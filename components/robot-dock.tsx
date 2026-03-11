"use client"

/**
 * RobotDock -- invisible placeholder that reserves space for the 3D robot.
 * The RobotController animates its canvas to overlay this element's position.
 * No card, no border, no background -- purely a layout anchor.
 */
export function RobotDock({
  id,
  className = "",
  label: _label,
}: {
  id: string
  className?: string
  label?: string
}) {
  return (
    <div
      data-robot-dock={id}
      className={`robot-dock relative ${className}`}
    />
  )
}
