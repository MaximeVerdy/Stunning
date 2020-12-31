import React, {useState, useEffect } from 'react'

import { ResponsiveBar } from '@nivo/bar'


export default function Nivo() {

const data = [
    {
        "country": "AD",
        "hot dog": 20,
        "hot dogColor": "hsl(75, 70%, 50%)",
        "burger": 177,
        "burgerColor": "hsl(189, 70%, 50%)",
        "sandwich": 187,
        "sandwichColor": "hsl(122, 70%, 50%)",
        "kebab": 52,
        "kebabColor": "hsl(125, 70%, 50%)",
        "fries": 53,
        "friesColor": "hsl(286, 70%, 50%)",
        "donut": 0,
        "donutColor": "hsl(40, 70%, 50%)",
        "choucroute": 50,
        "choucrouteColor": "hsl(286, 70%, 50%)",
    },
    {
        "country": "AE",
        "hot dog": 118,

        "burger": 125,
        "burgerColor": "hsl(281, 70%, 50%)",
        "sandwich": 102,
        "sandwichColor": "hsl(112, 70%, 50%)",
        "kebab": 148,
        "kebabColor": "hsl(75, 70%, 50%)",
        "fries": 36,
        "friesColor": "hsl(107, 70%, 50%)",
        "donut": 43,
        "donutColor": "hsl(207, 70%, 50%)"
    },
    {
        "country": "AF",
        "hot dog": 66,
        "hot dogColor": "hsl(188, 70%, 50%)",
        "burger": 90,
        "burgerColor": "hsl(101, 70%, 50%)",
        "sandwich": 139,
        "sandwichColor": "hsl(153, 70%, 50%)",
        "kebab": 90,
        "kebabColor": "hsl(54, 70%, 50%)",
        "fries": 144,
        "friesColor": "hsl(184, 70%, 50%)",
        "donut": 60,
        "donutColor": "hsl(125, 70%, 50%)"
    },
    {
        "country": "AG",
        "hot dog": 53,
        "hot dogColor": "hsl(333, 70%, 50%)",
        "burger": 20,
        "burgerColor": "hsl(162, 70%, 50%)",
        "sandwich": 58,
        "sandwichColor": "hsl(244, 70%, 50%)",
        "kebab": 96,
        "kebabColor": "hsl(261, 70%, 50%)",
        "fries": 12,
        "friesColor": "hsl(234, 70%, 50%)",
        "donut": 166,
        "donutColor": "hsl(229, 70%, 50%)"
    },
    {
        "country": "AI",
        "hot dog": 113,
        "hot dogColor": "hsl(206, 70%, 50%)",
        "burger": 151,
        "burgerColor": "hsl(332, 70%, 50%)",
        "sandwich": 52,
        "sandwichColor": "hsl(269, 70%, 50%)",
        "kebab": 120,
        "kebabColor": "hsl(236, 70%, 50%)",
        "fries": 103,
        "friesColor": "hsl(65, 70%, 50%)",
        "donut": 162,
        "donutColor": "hsl(357, 70%, 50%)"
    },
    {
        "country": "AL",
        "hot dog": 14,
        "hot dogColor": "hsl(277, 70%, 50%)",
        "burger": 6,
        "burgerColor": "hsl(28, 70%, 50%)",
        "sandwich": 112,
        "sandwichColor": "hsl(145, 70%, 50%)",
        "kebab": 133,
        "kebabColor": "hsl(119, 70%, 50%)",
        "fries": 35,
        "friesColor": "hsl(193, 70%, 50%)",
        "donut": 133,
        "donutColor": "hsl(123, 70%, 50%)"
    },
    {
        "country": "AM",
        "hot dog": 168,
        "hot dogColor": "hsl(55, 70%, 50%)",
        "burger": 148,
        "burgerColor": "hsl(279, 70%, 50%)",
        "sandwich": 194,
        "sandwichColor": "hsl(105, 70%, 50%)",
        "kebab": 200,
        "kebabColor": "hsl(136, 70%, 50%)",
        "fries": 16,
        "friesColor": "hsl(155, 70%, 50%)",
        "donut": 76,
        "donutColor": "hsl(148, 70%, 50%)"
    }
]


    
const GraphNivo = () => { 
    return (
        <ResponsiveBar
            data={data}
            groupMode= ''
            keys={[ 'hot dog', 'burger', 'sandwich', 'kebab', 'fries', 'donut', 'choucroute' ]}
            indexBy="country"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#eed312',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'fries'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'sandwich'
                    },
                    id: 'lines'
                }

            ]}
            borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'country',
                legendPosition: 'middle',
                legendOffset: 32
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'food',
                legendPosition: 'middle',
                legendOffset: -40
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
            legends={[
                {
                    dataFrom: 'keys',
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 100,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemOpacity: 1
                            }
                        }
                    ]
                }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
        />
    )
}



    return (
        <div
            style = {{
            display: 'flex',
            height: '400px',
            maxWidth: '800px'
        }}
        >
                <GraphNivo/>
        </div>

    )
}