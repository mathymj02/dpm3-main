/**
 * ============================================================================
 * Archivo: Card.tsx
 * Proyecto: DPM Pro - Club Deportes Puerto Montt
 * ============================================================================
 * 
 * ¿QUÉ HACE ESTE ARCHIVO?
 * Un componente UI genérico para mostrar información en un formato de "tarjeta".
 * Recibe componentes hijos (children) y aplica un estilo base uniforme.
 * 
 * ¿POR QUÉ ESTA TECNOLOGÍA?
 * Se utiliza `framer-motion` para inyectar feedback visual de interacción
 * (hover y tap), mejorando la percepción de interactividad de la UI.
 * 
 * DECISIONES DE DISEÑO / UX:
 * - Patrón de Componente Reutilizable: En lugar de repetir las clases de
 *   sombra, borde y borde redondeado en cada jugador, producto o noticia,
 *   se centraliza aquí (`bg-white rounded-xl shadow-sm border...`).
 * - Framer Motion: `whileHover={{ scale: 1.02, y: -5 }}` eleva la tarjeta
 *   sutilmente cuando el mouse pasa por encima, indicando que es clickeable.
 * ============================================================================
 */
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string; // Permite sobreescribir o añadir clases extra
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => {
  return (
    <motion.div
      // Efectos de animación al interactuar con el mouse
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      // Clases base combinadas con clases dinámicas
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
