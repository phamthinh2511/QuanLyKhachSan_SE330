package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.KhachhangRequestDto;
import hotelmanagement.backend.dto.response.KhachhangResponseDto;
import hotelmanagement.backend.service.KhachhangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class KhachhangController {

    private final KhachhangService khachhangService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<List<KhachhangResponseDto>> getAll() {
        return ResponseEntity.ok(khachhangService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<KhachhangResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(khachhangService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<KhachhangResponseDto> create(@jakarta.validation.Valid @RequestBody KhachhangRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(khachhangService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<KhachhangResponseDto> update(
            @PathVariable Integer id,
            @jakarta.validation.Valid
            @RequestBody KhachhangRequestDto dto) {
        return ResponseEntity.ok(khachhangService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        khachhangService.delete(id);
        return ResponseEntity.noContent().build();
    }
}