package pe.edu.cibertec.app_websocket_chat.chat.model;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class Mensaje {
    private TipoMensaje tipo;
    private String contenido;
    private String envio;
}
