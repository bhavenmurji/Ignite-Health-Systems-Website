import { StatCard } from '../StatCard'

export default function StatCardExample() {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        value="42.2%"
        label="Physicians in Private Practice"
        description="A stark decline driven by administrative pressures"
        trend="down"
      />
      <StatCard
        value="15.4"
        label="Hours/Week on Paperwork"
        description="Time stolen from patient care"
        trend="down"
      />
      <StatCard
        value="$100,000+"
        label="Annual Revenue Lost"
        description="Per physician due to EMR inefficiencies"
        trend="down"
      />
    </div>
  )
}