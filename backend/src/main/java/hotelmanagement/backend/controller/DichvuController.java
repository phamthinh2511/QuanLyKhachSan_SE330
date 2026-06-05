package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.DichvuRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.DichvuResponseDto;
import hotelmanagement.backend.service.DichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class DichvuController {
    private final DichvuService dichvuService;

    @GetMapping
    public ApiResponse<List<DichvuResponseDto>> getAll() {
        return ApiResponse.success(dichvuService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<DichvuResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(dichvuService.getById(id));
    }

    @PostMapping
    public ApiResponse<DichvuResponseDto> create(@Valid @RequestBody DichvuRequestDto dto) {
        DichvuResponseDto created = dichvuService.create(dto);
        ApiResponse<DichvuResponseDto> response = ApiResponse.success(created, "Tạo dịch vụ thành công");
        response.setCode(201);
        return response;
    }

    @PutMapping("/{id}")
    public ApiResponse<DichvuResponseDto> update(
            @PathVariable Integer id,
            @Valid @RequestBody DichvuRequestDto dto){
        return ApiResponse.success(dichvuService.update(id, dto), "Cập nhật dịch vụ thành công");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        dichvuService.delete(id);
        return ApiResponse.success(null, "Xóa dịch vụ thành công");
    }
}
