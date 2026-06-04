package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.InvoiceRequestDto;
import hotelmanagement.backend.dto.response.InvoiceResponseDto;
import hotelmanagement.backend.dto.response.InvoicePageResponseDto;
import hotelmanagement.backend.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<List<InvoiceResponseDto>> getAll() {
        return ResponseEntity.ok(invoiceService.getAll());
    }

    @GetMapping("/paged")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<InvoicePageResponseDto> getPaged(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(invoiceService.getPagedInvoices(year, month, search, status, page, size));
    }

    @GetMapping("/export")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public void exportInvoicesToCsv(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");
        response.setHeader("Content-Disposition", "attachment; filename=invoices.csv");

        java.io.OutputStream os = response.getOutputStream();
        // Write UTF-8 BOM so Excel opens it with correct Vietnamese accents
        os.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});

        PrintWriter writer = new PrintWriter(new java.io.OutputStreamWriter(os, java.nio.charset.StandardCharsets.UTF_8), true);
        writer.println("Mã hóa đơn,Mã đặt phòng,Tên khách hàng,Số phòng,Tiền phòng,Tiền dịch vụ,Tổng tiền,Phương thức thanh toán,Trạng thái,Ngày thanh toán");

        List<InvoiceResponseDto> list = invoiceService.getFilteredInvoices(year, month);
        for (InvoiceResponseDto dto : list) {
            String customerName = dto.getCustomerName() != null ? dto.getCustomerName().replace(",", " ") : "";
            writer.println(String.format("%s,%s,%s,%s,%.2f,%.2f,%.2f,%s,%s,%s",
                    dto.getInvoiceCode() != null ? dto.getInvoiceCode() : "",
                    dto.getBookingCode() != null ? dto.getBookingCode() : "",
                    customerName,
                    dto.getRoomNumber() != null ? dto.getRoomNumber() : "",
                    dto.getRoomCost() != null ? dto.getRoomCost() : 0.0,
                    dto.getServiceCost() != null ? dto.getServiceCost() : 0.0,
                    dto.getTotal() != null ? dto.getTotal() : 0.0,
                    dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "Tiền mặt",
                    dto.getStatus() != null ? dto.getStatus() : "Đã thanh toán",
                    dto.getCreatedAt() != null ? dto.getCreatedAt().toString() : ""
            ));
        }
        writer.flush();
    }

    @GetMapping("/revenue-report/export")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public void exportRevenueReport(
            @RequestParam String type,
            @RequestParam int year,
            @RequestParam(required = false) Integer value,
            HttpServletResponse response) throws IOException {
        response.setContentType("text/csv; charset=UTF-8");

        LocalDate startDate;
        LocalDate endDate;

        if ("month".equalsIgnoreCase(type)) {
            startDate = LocalDate.of(year, value, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        } else if ("quarter".equalsIgnoreCase(type)) {
            int startMonth = (value - 1) * 3 + 1;
            startDate = LocalDate.of(year, startMonth, 1);
            LocalDate lastMonthOfQuarter = LocalDate.of(year, startMonth + 2, 1);
            endDate = lastMonthOfQuarter.withDayOfMonth(lastMonthOfQuarter.lengthOfMonth());
        } else { // year
            startDate = LocalDate.of(year, 1, 1);
            endDate = LocalDate.of(year, 12, 31);
        }

        response.setHeader("Content-Disposition", String.format("attachment; filename=revenue_report_%s_%d_%s.csv", type, year, value != null ? value : ""));

        java.io.OutputStream os = response.getOutputStream();
        // Write UTF-8 BOM
        os.write(new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF});

        PrintWriter writer = new PrintWriter(new java.io.OutputStreamWriter(os, java.nio.charset.StandardCharsets.UTF_8), true);
        writer.println("Ngày,Số lượng hóa đơn,Doanh thu phòng,Doanh thu dịch vụ,Tổng doanh thu");

        List<InvoiceResponseDto> list = invoiceService.getInvoicesInPeriod(startDate, endDate);
        
        // Group by Date
        Map<LocalDate, List<InvoiceResponseDto>> grouped = list.stream()
                .filter(dto -> dto.getCreatedAt() != null)
                .collect(Collectors.groupingBy(InvoiceResponseDto::getCreatedAt));

        // Sort dates ascending
        List<LocalDate> sortedDates = grouped.keySet().stream().sorted().collect(Collectors.toList());

        for (LocalDate date : sortedDates) {
            List<InvoiceResponseDto> dayInvoices = grouped.get(date);
            long count = dayInvoices.size();
            double roomRevenue = dayInvoices.stream().mapToDouble(dto -> dto.getRoomCost() != null ? dto.getRoomCost() : 0.0).sum();
            double serviceRevenue = dayInvoices.stream().mapToDouble(dto -> dto.getServiceCost() != null ? dto.getServiceCost() : 0.0).sum();
            double totalRevenue = dayInvoices.stream().mapToDouble(dto -> dto.getTotal() != null ? dto.getTotal() : 0.0).sum();

            writer.println(String.format("%s,%d,%.2f,%.2f,%.2f",
                    date.toString(),
                    count,
                    roomRevenue,
                    serviceRevenue,
                    totalRevenue
            ));
        }
        writer.flush();
    }
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<InvoiceResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(invoiceService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<InvoiceResponseDto> create(@Valid @RequestBody InvoiceRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<InvoiceResponseDto> update(
            @PathVariable Integer id,
            @RequestBody InvoiceResponseDto dto) {
        return ResponseEntity.ok(invoiceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
