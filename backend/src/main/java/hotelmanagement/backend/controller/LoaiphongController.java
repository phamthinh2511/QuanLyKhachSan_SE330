package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.LoaiPhongRequestDto;
import hotelmanagement.backend.dto.response.LoaiPhongResponseDto;
import hotelmanagement.backend.service.LoaiphongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class LoaiphongController {
    private final LoaiphongService loaiphongService;

    @GetMapping
    public ResponseEntity<List<LoaiPhongResponseDto>> getAll() {
        return ResponseEntity.ok(loaiphongService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoaiPhongResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(loaiphongService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LoaiPhongResponseDto> create(@RequestBody LoaiPhongRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loaiphongService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LoaiPhongResponseDto> update(
            @PathVariable Integer id,
            @RequestBody LoaiPhongRequestDto dto) {
        return ResponseEntity.ok(loaiphongService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        loaiphongService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
