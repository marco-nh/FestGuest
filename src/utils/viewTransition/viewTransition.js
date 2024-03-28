if (document.startViewTransition) {
    window.navigation.addEventListener('navigate', async (event) => {
        const toUrl = new URL(event.destination.url);
        
        // Ignorar si es una página externa
        if (location.origin !== toUrl.origin) return;

        // Interceptación de la navegación en el mismo dominio
        event.intercept({
            async handler() {
                try {
                    // Cargar la página de destino utilizando fetch para obtener el HTML
                    const response = await fetch(toUrl.pathname);
                    if (!response.ok) {
                        throw new Error('Failed to load page');
                    }
                    // Extraer el contenido de la página de destino
                    const text = await response.text();
                    const tempElement = document.createElement('div');
                    tempElement.innerHTML = text;
                    const newContent = tempElement.querySelector('#content').innerHTML;
                    // Actualizar la página con el nuevo contenido
                    document.startViewTransition(() => {
                        document.getElementById('content').innerHTML = newContent;
                        document.documentElement.scrollTop = 0;
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        });
    });
}