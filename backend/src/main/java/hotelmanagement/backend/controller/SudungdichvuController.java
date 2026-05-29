package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.SudungdichvuRequestDto;
import hotelmanagement.backend.dto.response.SudungdichvuResponseDto;
import hotelmanagement.backend.service.SudungdichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/serviceusages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SudungdichvuController {
    private final SudungdichvuService sudungdichvuService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<List<SudungdichvuResponseDto>> getAll() {
        return ResponseEntity.ok(sudungdichvuService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<SudungdichvuResponseDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(sudungdichvuService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<SudungdichvuResponseDto> create(@RequestBody SudungdichvuRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(sudungdichvuService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<SudungdichvuResponseDto> update(
            @PathVariable Integer id,
            @RequestBody SudungdichvuRequestDto dto) {
        return ResponseEntity.ok(sudungdichvuService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        sudungdichvuService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
