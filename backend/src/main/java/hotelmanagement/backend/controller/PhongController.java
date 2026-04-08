package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.PhongDTO;
import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.repository.PhongRepository;
import hotelmanagement.backend.service.KhachhangService;
import hotelmanagement.backend.service.PhongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class PhongController {
    private final PhongService phongService;
    private final KhachhangService khachhangService;

    @GetMapping
    public ResponseEntity<List<PhongDTO>> getAll() { return ResponseEntity.ok(phongService.getAll()); }

    @GetMapping("/{id}")
    public ResponseEntity<PhongDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(phongService.getById(id));
    }

    @PostMapping
    public ResponseEntity<PhongDTO> create(@RequestBody PhongDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(phongService.create(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<PhongDTO> update(
            @PathVariable Integer id,
            @RequestBody PhongDTO dto){
        return ResponseEntity.ok(phongService.update(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        phongService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
