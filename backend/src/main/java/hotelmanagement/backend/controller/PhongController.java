package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.PhongRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.PhongResponseDto;
import hotelmanagement.backend.service.PhongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class PhongController {
    private final PhongService phongService;

    @GetMapping
    public ApiResponse<List<PhongResponseDto>> getAll() {
        return ApiResponse.success(phongService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<PhongResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(phongService.getById(id));
    }

    @PostMapping
    public ApiResponse<PhongResponseDto> create(@RequestBody PhongRequestDto dto) {
        PhongResponseDto created = phongService.create(dto);
        ApiResponse<PhongResponseDto> response = ApiResponse.success(created, "Tạo phòng thành công");
        response.setCode(201);
        return response;
    }

    @PutMapping("/{id}")
    public ApiResponse<PhongResponseDto> update(
            @PathVariable Integer id,
            @RequestBody PhongRequestDto dto){
        return ApiResponse.success(phongService.update(id, dto), "Cập nhật phòng thành công");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        phongService.delete(id);
        return ApiResponse.success(null, "Xóa phòng thành công");
    }
}
