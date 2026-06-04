package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.service.AiChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiChatController {

    private final AiChatService aiChatService;

    /**
     * DTO Request nhận câu hỏi từ Client
     */
    public record ChatRequest(String question) {}

    /**
     * API 1: Chatbot tư vấn nội bộ cho nhân viên
     * POST /api/ai/chat
     */
    @PostMapping("/chat")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<ApiResponse<String>> chat(@RequestBody ChatRequest request) {
        if (request.question() == null || request.question().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .message("Câu hỏi không được để trống!")
                    .build());
        }

        String answer = aiChatService.generateChatResponse(request.question());
        
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(200)
                .message("Thành công")
                .result(answer)
                .build());
    }
}
