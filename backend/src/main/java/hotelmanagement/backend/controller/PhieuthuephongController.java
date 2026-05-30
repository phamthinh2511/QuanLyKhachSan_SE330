package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.response.PhieuthuephongResponseDto;
import hotelmanagement.backend.service.PhieuthuephongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PhieuthuephongController {
    private final PhieuthuephongService phieuthuephongService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<List<PhieuthuephongResponseDto>> getAll() {
        return ResponseEntity.ok(phieuthuephongService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<PhieuthuephongResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(phieuthuephongService.getById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        phieuthuephongService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
