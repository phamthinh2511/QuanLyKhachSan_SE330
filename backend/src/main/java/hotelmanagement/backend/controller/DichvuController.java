package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.DichvuRequestDto;
import hotelmanagement.backend.dto.response.DichvuResponseDto;
import hotelmanagement.backend.service.DichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class DichvuController {
    private final DichvuService dichvuService;

    @GetMapping
    public ResponseEntity<List<DichvuResponseDto>> getAll() { 
        return ResponseEntity.ok(dichvuService.getAll()); 
    }

    @GetMapping("/{id}")
    public ResponseEntity<DichvuResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(dichvuService.getById(id));
    }

    @PostMapping
    public ResponseEntity<DichvuResponseDto> create(@RequestBody DichvuRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(dichvuService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DichvuResponseDto> update(
            @PathVariable Integer id,
            @RequestBody DichvuRequestDto dto){
        return ResponseEntity.ok(dichvuService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        dichvuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
