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
            
            String response1 = aiChatService.generateChatResponse("Hôm nay còn bao nhiêu phòng trống?");
            System.out.println("Chatbot response (today available): " + response1);
            
            String response2 = aiChatService.generateChatResponse("Vào ngày 17/06/2026 có những phòng nào đang sử dụng?");
            System.out.println("Chatbot response (occupied 17/06): " + response2);

            String response3 = aiChatService.generateChatResponse("Vào ngày 15/05/2026 có những phòng nào đang sử dụng?");
            System.out.println("Chatbot response (occupied 15/05): " + response3);

            String response4 = aiChatService.generateChatResponse("Tìm kiếm cho tôi đơn đặt phòng hoặc hóa đơn nào liên quan đến khách hàng tên là Khánh hoặc số điện thoại 0912345678?");
            System.out.println("Chatbot response (search booking/invoice): " + response4);
            
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
