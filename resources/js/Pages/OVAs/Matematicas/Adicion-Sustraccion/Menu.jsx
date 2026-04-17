// MenuPrincipal.jsx
import React, { useEffect, useRef } from 'react';

const MenuPrincipal = () => {
  const stageRef = useRef(null);

  useEffect(() => {
    // Cargar jQuery primero
    const loadjQuery = () => {
      return new Promise((resolve, reject) => {
        if (window.jQuery) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        script.onload = () => {
          window.$ = window.jQuery;
          resolve();
        };
        script.onerror = () => reject(new Error('Error loading jQuery'));
        document.head.appendChild(script);
      });
    };

    // Cargar Adobe Edge después de jQuery
    const loadAdobeEdge = () => {
      return new Promise((resolve, reject) => {
        if (window.AdobeEdge) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = '/OVAs/Matematicas/Adicion-Sustraccion/js/edge.6.0.0.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error loading Adobe Edge'));
        document.head.appendChild(script);
      });
    };

    // Cargar la composición
    const loadComposition = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/OVAs/Matematicas/Adicion-Sustraccion/js/Menuprincipalovas5_edge.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Error loading composition'));
        document.head.appendChild(script);
      });
    };

    const initializeAdobeEdge = async () => {
      try {
        await loadjQuery();
        await loadAdobeEdge();
        await loadComposition();
        
        // Esperar a que todo esté cargado
        setTimeout(() => {
          if (window.AdobeEdge && window.AdobeEdge.loadComposition) {
            window.AdobeEdge.loadComposition(
              "/OVAs/Matematicas/Adicion-Sustraccion/js/Menuprincipalovas5",
              "EDGE-16317474",
              {
                scaleToFit: "width",
                centerStage: "horizontal",
                minW: "0px",
                maxW: "undefined",
                width: "1920px",
                height: "1080px",
              },
              {
                style: {
                  "${symbolSelector}": {
                    isStage: "true",
                    rect: ["undefined", "undefined", "1920px", "1080px"],
                    fill: ["rgba(255,255,255,1)"],
                  },
                },
                dom: [
                  {
                    rect: ["850", "531", "220px", "19px", "auto", "auto"],
                    id: "loader-bar",
                    fill: [
                      "rgba(0,0,0,0)",
                      "/OVAs/Shared/loader-bar.gif",
                      "0px",
                      "0px",
                    ],
                    type: "image",
                    tag: "img",
                  },
                ],
              },
              {
                style: {
                  "${symbolSelector}": {
                    isStage: "true",
                    rect: ["undefined", "undefined", "1920px", "1080px"],
                    fill: ["rgba(255,255,255,1)"],
                  },
                },
                dom: [
                  {
                    rect: ["0", "0", "1920px", "1080px", "auto", "auto"],
                    id: "Poster",
                    fill: [
                      "rgba(0,0,0,0)",
                      "/OVAs/Matematicas/Adicion-Sustraccion/images/backgrounds/bg_main_poster.png",
                      "0px",
                      "0px",
                    ],
                    type: "image",
                    tag: "img",
                  },
                ],
              }
            );
          }
        }, 500);
      } catch (error) {
        console.error('Error initializing Adobe Edge:', error);
      }
    };

    initializeAdobeEdge();
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div id="todosonido"></div>

      <a
        href="/ovas/matematicas/adicion-sustraccion/inicio"
        className="sonido_hover"
        data-sonido="/OVAs/Matematicas/Adicion-Sustraccion/sounds/intro/intro_play.mp3"
      >
        <img
          className="verintro"
          src="/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_intro.png"
          alt="Ver introducción"
          style={{
            position: 'absolute',
            zIndex: 5000,
            width: '14%',
            top: '2%',
            left: '1%',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => {
            e.currentTarget.src = "/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_intro_hover.png";
          }}
          onMouseOut={(e) => {
            e.currentTarget.src = "/OVAs/Matematicas/Adicion-Sustraccion/images/buttons/btn_intro.png";
          }}
        />
      </a>

      <div id="Stage" className="EDGE-16317474" ref={stageRef} style={{ width: '100%', height: '100%' }}></div>

      <style>{`
        .edgeLoad-EDGE-16317474 {
          visibility: hidden;
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        #Stage {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default MenuPrincipal;