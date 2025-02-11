package com.appsmith.server.services.ce;

import com.appsmith.server.dtos.ce.ProductAlertResponseDTO;
import reactor.core.publisher.Mono;

import java.util.List;

public interface ProductAlertServiceCE {
    Mono<List<ProductAlertResponseDTO>> getSingleApplicableMessage();
}
