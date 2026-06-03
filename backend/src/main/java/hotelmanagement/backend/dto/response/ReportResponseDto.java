package hotelmanagement.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponseDto {
    private double revenue;
    private double profit;
    private double occupancy;
    private long guests;
    private double expenses;
    private ChartDataDto chartData;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChartDataDto {
        private List<String> labels;
        private List<Double> revenue;
        private List<Double> profit;
        private List<Double> occupancy;
        private List<Long> guests;
    }
}
