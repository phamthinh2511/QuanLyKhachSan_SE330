package hotelmanagement.backend;

import hotelmanagement.backend.service.BookingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

@SpringBootTest
class BackendApplicationTests {

    @Autowired
    private BookingService bookingService;
    @Test
    void testCheckAvailableRooms(){
        LocalDate checkIn = LocalDate.of(2026, 5, 15);
        LocalDate checkOut = LocalDate.of(2026, 5, 20);
        var rooms = bookingService.getAvailableRooms(checkIn, checkOut);
        System.out.println("Tim thay " + rooms.size() + " phong trong ");
        rooms.forEach(r -> System.out.println("Ma phong: " + r.getId() + " - Trang thai: " + r.getTrangThai()));
    }
    @Autowired
    private hotelmanagement.backend.service.AiChatService aiChatService;

    @Test
    void testChatbot() {
        try {
            System.out.println("CHATBOT TEST START");
            String response = aiChatService.generateChatResponse("Hôm nay còn bao nhiêu phòng trống?");
            System.out.println("Chatbot response: " + response);
            System.out.println("CHATBOT TEST END");
        } catch (Exception e) {
            System.err.println("Chatbot test failed with exception:");
            e.printStackTrace();
        }
    }

    @Test
    void contextLoads() {
    }

}
