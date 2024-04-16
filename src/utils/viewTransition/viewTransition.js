/** BUG DETECTED!!!! DONT TOUCH
 *  PROBLEM WITH DOM TRANSITION
 *  
if (document.startViewTransition) {
    window.navigation.addEventListener('navigate', async (event) => {
        const toUrl = new URL(event.destination.url);
        
        // Ignorar si es una página externa
        if (location.origin !== toUrl.origin) return;

        event.intercept({
            async handler() {
                try {
                    // Cargar la página de destino completa
                    const response = await fetch(toUrl.href);
                    if (!response.ok) {
                        throw new Error('Failed to load page');
                    }
                    // Extraer el HTML de la respuesta
                    const html = await response.text();
                    
                    // Verificar si el elemento body existe en el HTML recibido
                    const bodyElement = document.createElement('div');
                    bodyElement.innerHTML = html;
                    const newContent = bodyElement.querySelector('body') ? bodyElement.querySelector('body').innerHTML : html;

                    // Aplicar la transición de vista después de cargar la nueva página
                    document.startViewTransition(() => {
                        // Actualizar el contenido de la página con el nuevo contenido
                        document.getElementById('content').innerHTML = newContent;
                        // Llamar a la función para cargar scripts y estilos
                        loadScripts();
                        // Desplazar al inicio de la página
                        document.documentElement.scrollTop = 0;
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    });
}
*/