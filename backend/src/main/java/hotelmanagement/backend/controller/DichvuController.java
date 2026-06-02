package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.DichvuRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.DichvuResponseDto;
import hotelmanagement.backend.service.DichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class DichvuController {
    private final DichvuService dichvuService;

    @GetMapping
    public ApiResponse<List<DichvuResponseDto>> getAll() { 
        return ApiResponse.<List<DichvuResponseDto>>builder()
                .result(dichvuService.getAll())
                .build(); 
    }

    @GetMapping("/{id}")
    public ApiResponse<DichvuResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.<DichvuResponseDto>builder()
                .result(dichvuService.getById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<DichvuResponseDto> create(@RequestBody DichvuRequestDto dto) {
        return ApiResponse.<DichvuResponseDto>builder()
                .code(201)
                .message("Tạo dịch vụ thành công")
                .result(dichvuService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DichvuResponseDto> update(
            @PathVariable Integer id,
            @RequestBody DichvuRequestDto dto){
        return ApiResponse.<DichvuResponseDto>builder()
                .message("Cập nhật dịch vụ thành công")
                .result(dichvuService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        dichvuService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa dịch vụ thành công")
                .build();
    }
}
