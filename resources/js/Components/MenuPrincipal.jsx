// resources/js/components/MenuPrincipal.jsx (modificado)
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MenuPrincipal = () => {
  const navigate = useNavigate();
  const stageRef = useRef(null);

  // Mapeo de rutas para los botones de Adobe Edge
  const routeMapping = {
    'adicion-y-sus-propiedades': '/ova/adicion-y-sus-propiedades',
    'adicion-de-numeros-hasta-el-19': '/ova/adicion-numeros-hasta-19',
    'adicion-de-numeros-de-dos-cifras': '/ova/adicion-numeros-dos-cifras',
    'adicion-de-numeros-de-tres-cifras': '/ova/adicion-numeros-tres-cifras',
    'sustraccion-de-numeros-hasta-el-19': '/ova/sustraccion-numeros-hasta-19',
    'sustraccion-de-numeros-de-dos-cifras': '/ova/sustraccion-numeros-dos-cifras',
    'sustraccion-de-numeros-de-tres-cifras': '/ova/sustraccion-numeros-tres-cifras'
  };

  useEffect(() => {
    // ... (código de carga de Adobe Edge que ya tienes)
    
    // Interceptar clicks de los botones de Adobe Edge
    const handleEdgeButtonClick = (event) => {
      const target = event.target.closest('[id^="boton"]');
      if (target) {
        const buttonId = target.id;
        const route = getRouteFromButtonId(buttonId);
        if (route) {
          navigate(route);
        }
      }
    };

    const getRouteFromButtonId = (buttonId) => {
      const mapping = {
        'boton1': routeMapping['adicion-y-sus-propiedades'],
        'boton2': routeMapping['adicion-de-numeros-hasta-el-19'],
        'boton3': routeMapping['adicion-de-numeros-de-dos-cifras'],
        'boton4': routeMapping['adicion-de-numeros-de-tres-cifras'],
        'boton5': routeMapping['sustraccion-de-numeros-hasta-el-19'],
        'boton6': routeMapping['sustraccion-de-numeros-de-dos-cifras'],
        'boton7': routeMapping['sustraccion-de-numeros-de-tres-cifras']
      };
      return mapping[buttonId];
    };

    document.addEventListener('click', handleEdgeButtonClick);
    
    return () => {
      document.removeEventListener('click', handleEdgeButtonClick);
    };
  }, [navigate]);


};