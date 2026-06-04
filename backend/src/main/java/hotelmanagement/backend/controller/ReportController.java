package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.response.ReportResponseDto;
import hotelmanagement.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<ReportResponseDto> getReport(
            @RequestParam String type,
            @RequestParam int year,
            @RequestParam(required = false) Integer value) {
        return ResponseEntity.ok(reportService.getReport(type, year, value));
    }
}
