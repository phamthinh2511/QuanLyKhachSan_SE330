package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.LoaiPhongRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.LoaiPhongResponseDto;
import hotelmanagement.backend.service.LoaiphongService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class LoaiphongController {
    private final LoaiphongService loaiphongService;

    @GetMapping
    public ApiResponse<List<LoaiPhongResponseDto>> getAll() {
        return ApiResponse.success(loaiphongService.getAll());
    }

    @GetMapping("/{id}")
    public ApiResponse<LoaiPhongResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(loaiphongService.getById(id));
    }

    @PostMapping
    public ApiResponse<LoaiPhongResponseDto> create(@RequestBody LoaiPhongRequestDto dto) {
        LoaiPhongResponseDto created = loaiphongService.create(dto);
        ApiResponse<LoaiPhongResponseDto> response = ApiResponse.success(created, "Tạo loại phòng thành công");
        response.setCode(201);
        return response;
    }

    @PutMapping("/{id}")
    public ApiResponse<LoaiPhongResponseDto> update(
            @PathVariable Integer id,
            @RequestBody LoaiPhongRequestDto dto) {
        return ApiResponse.success(loaiphongService.update(id, dto), "Cập nhật loại phòng thành công");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        loaiphongService.delete(id);
        return ApiResponse.success(null, "Xóa loại phòng thành công");
    }
}
