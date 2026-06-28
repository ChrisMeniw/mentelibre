import ChibiAvatar from '../ChibiAvatar'

// BAMBÚ (6-8 · nivel 3) — pandita.
export default function Bambu(props) {
  return (
    <ChibiAvatar
      id="bambu" bg={['#ffffff', '#d7dde6']} eyeY={58}
      body={<g>
        {/* orejas redondas negras */}
        <circle cx="26" cy="15" r="13" fill="#2b2b35" />
        <circle cx="94" cy="15" r="13" fill="#2b2b35" />
        {/* parches negros de los ojos */}
        <ellipse cx="48" cy="56" rx="12.5" ry="15.5" fill="#2b2b35" transform="rotate(-12 48 56)" />
        <ellipse cx="72" cy="56" rx="12.5" ry="15.5" fill="#2b2b35" transform="rotate(12 72 56)" />
        {/* nariz */}
        <ellipse cx="60" cy="70" rx="5" ry="3.5" fill="#2b2b35" />
      </g>}
      {...props}
    />
  )
}
