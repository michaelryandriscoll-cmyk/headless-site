"use client";

import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import { useRouter } from "next/navigation";

export default function UsaStateMap() {
  const router = useRouter();

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "60px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        Explore Funding Options By State
      </h2>

      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              // FIX — safely pull name from TopoJSON
              const stateName = geo.properties.name ?? "unknown";
              const slug = stateName.toLowerCase().replace(/ /g, "-");

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => router.push(`/states/${slug}`)}
                  style={{
                    default: { fill: "#ccefe1", stroke: "#007a55", strokeWidth: 0.5 },
                    hover: { fill: "#00C684", cursor: "pointer" },
                    pressed: { fill: "#028a5a" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}