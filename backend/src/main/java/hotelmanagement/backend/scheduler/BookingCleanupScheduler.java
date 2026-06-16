package hotelmanagement.backend.scheduler;

import hotelmanagement.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class BookingCleanupScheduler {

    @Autowired
    private BookingService bookingService;

    // Runs at minute 0 of every hour
    @Scheduled(cron = "0 0 * * * *")
    public void tuDongHuyDonDatPhongQuaHanJob() {
        try {
            bookingService.tuDongHuyDonDatPhongQuaHan();
            System.out.println("Scheduler: Checked and automatically cancelled expired bookings successfully.");
        } catch (Exception e) {
            System.err.println("Scheduler Error: Failed to automatically cancel expired bookings: " + e.getMessage());
        }
    }
}
