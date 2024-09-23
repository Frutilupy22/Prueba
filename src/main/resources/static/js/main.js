$(document).ready(function(){

    var usernamePage = $("#username-page");
    var chatPage = $("#chat-page");
    var usernameForm = $("#usernameForm");
    var messageForm = $("#messageForm");
    var messageArea = $("#messageArea");
    var connectingElement = $(".connecting");
    var stompClient = null;
    var username = null;


 // Lista de colores predeterminados
    var colors = ["#FF6347", "#4682B4", "#32CD32", "#FFD700", "#6A5ACD", "#FF1493", "#00CED1", "#FF4500"];

    // Función
    function getColorForUsername(username) {
        var index = username.charCodeAt(0) % colors.length;
        return colors[index];
    }



    function conectarUsuario(event){
        username = $("#name").val().trim();
        if(username){
            usernamePage.addClass("d-none");
            chatPage.removeClass("d-none");
            var socket = new SockJS("/websocket");
            stompClient = Stomp.over(socket);
            stompClient.connect({}, onConnected, onError)

        }
        event.preventDefault();
    }

    function onConnected(){
    stompClient.subscribe("/topic/public", onMessageReceived);
    stompClient.send("/app/chat.addUser",{},JSON.stringify({
    envio: username, tipo: 'UNIR'}));
    connectingElement.addClass("d-none");
    }

    function onError(){
        connectingElement.text("No se pudo establecer conexion con el servidor WebSocket");
        connectingElement.css('color','red');
    }

    function onMessageReceived(payload){
        var message = JSON.parse(payload.body);
        var messageElement = $("<li>").addClass("list-group-item");
        if(message.tipo === 'UNIR'){
            messageElement.addClass("event-message").text(message.envio
            +" se unio al chat");
        } else if (message.tipo === 'DEJAR') {
                   messageElement.addClass("event-message").text(message.envio + " se retiro del chat");
       } else {

          var color = getColorForUsername(message.envio);

           // var usernameElement = $("<strong>").text(message.envio + ": ");
             var usernameElement = $("<strong>").text(message.envio + ": ").css("color", color);
            var textElement = $("<span>").text(message.contenido);
            messageElement.append(usernameElement).append(textElement);
        }


        messageArea.append(messageElement);
        messageArea.scrollTop(messageArea[0].scrollHeight)
    }

    function enviarMensaje(){
        var messageContent = $("#message").val().trim();
        if(messageContent && stompClient){
            var chatMessage = {
                envio: username,
                contenido: messageContent,
                tipo: "CHAT"
            };
            stompClient.send("/app/chat.sendMessage",{},JSON.stringify(chatMessage));
            $("#message").val("")
        }
        event.preventDefault();
    }


    usernameForm.on("submit", conectarUsuario);
    messageForm.on("submit", enviarMensaje);

});