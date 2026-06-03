package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.response.ReportResponseDto;
import hotelmanagement.backend.entity.Phieuthuephong;
import hotelmanagement.backend.repository.HoadonRepository;
import hotelmanagement.backend.repository.PhieuthuephongRepository;
import hotelmanagement.backend.repository.PhongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final HoadonRepository hoadonRepository;
    private final PhieuthuephongRepository phieuthuephongRepository;
    private final PhongRepository phongRepository;

    public ReportResponseDto getReport(String type, int year, Integer value) {
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

        // 1. Tính toán KPIs tổng quan cho khoảng thời gian này
        double revenue = hoadonRepository.sumTotalAmountWithDate(startDate, endDate);
        double profit = revenue * 0.6;
        double expenses = revenue * 0.4;
        long guests = hoadonRepository.sumGuestsWithDate(startDate, endDate);
        double occupancy = calculateOccupancyRate(startDate, endDate);

        // 2. Tạo dữ liệu cho biểu đồ
        List<String> labels = new ArrayList<>();
        List<Double> chartRevenue = new ArrayList<>();
        List<Double> chartProfit = new ArrayList<>();
        List<Double> chartOccupancy = new ArrayList<>();
        List<Long> chartGuests = new ArrayList<>();

        if ("month".equalsIgnoreCase(type)) {
            // Chia tháng thành 4 tuần
            int lastDay = endDate.getDayOfMonth();
            int[][] weekRanges = {
                {1, 7},
                {8, 14},
                {15, 21},
                {22, lastDay}
            };

            for (int i = 0; i < 4; i++) {
                LocalDate weekStart = LocalDate.of(year, value, weekRanges[i][0]);
                LocalDate weekEnd = LocalDate.of(year, value, weekRanges[i][1]);

                labels.add("Tuần " + (i + 1));
                
                double wRev = hoadonRepository.sumTotalAmountWithDate(weekStart, weekEnd);
                chartRevenue.add(wRev);
                chartProfit.add(wRev * 0.6);
                chartGuests.add(hoadonRepository.sumGuestsWithDate(weekStart, weekEnd));
                chartOccupancy.add(calculateOccupancyRate(weekStart, weekEnd));
            }
        } else if ("quarter".equalsIgnoreCase(type)) {
            // Lọc theo 3 tháng của quý
            int startMonth = (value - 1) * 3 + 1;
            for (int i = 0; i < 3; i++) {
                int currentMonth = startMonth + i;
                LocalDate mStart = LocalDate.of(year, currentMonth, 1);
                LocalDate mEnd = mStart.withDayOfMonth(mStart.lengthOfMonth());

                labels.add("Tháng " + currentMonth);

                double mRev = hoadonRepository.sumTotalAmountWithDate(mStart, mEnd);
                chartRevenue.add(mRev);
                chartProfit.add(mRev * 0.6);
                chartGuests.add(hoadonRepository.sumGuestsWithDate(mStart, mEnd));
                chartOccupancy.add(calculateOccupancyRate(mStart, mEnd));
            }
        } else { // year
            // Lọc theo 12 tháng
            for (int m = 1; m <= 12; m++) {
                LocalDate mStart = LocalDate.of(year, m, 1);
                LocalDate mEnd = mStart.withDayOfMonth(mStart.lengthOfMonth());

                labels.add("Th" + m);

                double mRev = hoadonRepository.sumTotalAmountWithDate(mStart, mEnd);
                chartRevenue.add(mRev);
                chartProfit.add(mRev * 0.6);
                chartGuests.add(hoadonRepository.sumGuestsWithDate(mStart, mEnd));
                chartOccupancy.add(calculateOccupancyRate(mStart, mEnd));
            }
        }

        ReportResponseDto.ChartDataDto chartData = ReportResponseDto.ChartDataDto.builder()
                .labels(labels)
                .revenue(chartRevenue)
                .profit(chartProfit)
                .occupancy(chartOccupancy)
                .guests(chartGuests)
                .build();

        return ReportResponseDto.builder()
                .revenue(revenue)
                .profit(profit)
                .occupancy(occupancy)
                .guests(guests)
                .expenses(expenses)
                .chartData(chartData)
                .build();
    }

    private double calculateOccupancyRate(LocalDate start, LocalDate end) {
        long totalRooms = phongRepository.count();
        if (totalRooms == 0) return 0.0;

        List<Phieuthuephong> activePt = phieuthuephongRepository.findActiveInPeriod(start, end);
        long totalOccupiedRoomNights = 0;

        long totalDaysInPeriod = ChronoUnit.DAYS.between(start, end) + 1;

        for (Phieuthuephong pt : activePt) {
            LocalDate ptStart = pt.getNgayNhanPhong();
            LocalDate ptEnd = pt.getNgayTraPhong();

            // Tính giao của [ptStart, ptEnd] và [start, end]
            LocalDate overlapStart = ptStart.isBefore(start) ? start : ptStart;
            LocalDate overlapEnd = ptEnd.isAfter(end) ? end : ptEnd;

            long occupiedDays = ChronoUnit.DAYS.between(overlapStart, overlapEnd);
            if (occupiedDays > 0) {
                totalOccupiedRoomNights += occupiedDays;
            }
        }

        double rate = (totalOccupiedRoomNights * 100.0) / (totalRooms * totalDaysInPeriod);
        return Math.min(100.0, Math.max(0.0, rate));
    }
}
