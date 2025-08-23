# ¿Qué es un Observable?

Un **Observable** es un patrón muy similar a **MQTT**, ya que maneja un modelo de **publicación/suscripción**.

- Un **Observable** permite que alguien se suscriba a un flujo de datos o eventos.  
- Si estás suscripto, es como si estuvieras escuchando un *tópico*: recibirás mensajes **asíncronos**, es decir, no sabes exactamente cuándo van a llegar.  
- También es posible **cancelar la suscripción** (desuscribirse) para dejar de recibir eventos.  

## Flujo de funcionamiento

1. La **API** actúa como *publisher* (publicador).  
2. El **método** que implementamos es el *subscriber* (suscriptor), que escucha la respuesta del request.  
3. Una vez que la API responde, la suscripción se cancela automáticamente.  

---

✅ En resumen: un Observable permite manejar **eventos asincrónicos**, dando flexibilidad para escuchar, reaccionar y luego cortar la suscripción cuando ya no se necesite.
