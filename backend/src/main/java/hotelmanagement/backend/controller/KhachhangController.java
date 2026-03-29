package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.KhachhangDTO;
import hotelmanagement.backend.service.KhachhangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class KhachhangController {

    private final KhachhangService khachhangService;

    // GET /api/customers
    @GetMapping
    public ResponseEntity<List<KhachhangDTO>> getAll() {
        return ResponseEntity.ok(khachhangService.getAll());
    }

    // GET /api/customers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<KhachhangDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(khachhangService.getById(id));
    }

    // POST /api/customers
    @PostMapping
    public ResponseEntity<KhachhangDTO> create(@RequestBody KhachhangDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(khachhangService.create(dto));
    }

    // PUT /api/customers/{id}
    @PutMapping("/{id}")
    public ResponseEntity<KhachhangDTO> update(
            @PathVariable Integer id,
            @RequestBody KhachhangDTO dto) {
        return ResponseEntity.ok(khachhangService.update(id, dto));
    }

    // DELETE /api/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        khachhangService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
