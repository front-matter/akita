import React from 'react';
import { VegaLite } from 'react-vega';
import Pluralize from 'react-pluralize'
import { Grid, Row } from 'react-bootstrap';
/* eslint-disable no-unused-vars */
import { VisualizationSpec } from 'vega-embed';
/* eslint-disable no-unused-vars */
import { Attribute } from '../PersonContainer/PersonContainer'

interface ChartRecord {
  title: string
  count: number
}

type Props = {
  data?: ChartRecord[],
  id?: string,
  doiCount: number
}

const actions = {
  export: true,
  source: false,
  compiled: false,
  editor: false,
}

/* eslint-disable no-unused-vars */
const ProductionChart: React.FunctionComponent<Props> = ({ data, id, doiCount }) => {

  /* istanbul ignore next */
  const thisYear = new Date().getFullYear() + 1

  /* istanbul ignore next */
  const lowerBoundYear = thisYear - 20

  /* istanbul ignore next */
  const yearsDomain = thisYear - lowerBoundYear;

  /* istanbul ignore next */
  const spec: VisualizationSpec = {
    $schema: "https://vega.github.io/schema/vega-lite/v4.json",
    data: {
      name: 'table'
    },
    transform: [
      {
        calculate: "toNumber(datum.title)",
        as: "period"
      },
      {
        calculate: "toNumber(datum.title)+1",
        as: "bin_end"
      },
      {
        filter: "toNumber(datum.title) >" + lowerBoundYear
      }
    ],
    width: yearsDomain * 25,
    mark: {
      type: "bar",
      cursor: "pointer",
      tooltip: true,
    },
    selection: {
      highlight: {
        type: "single",
        empty: "none",
        on: "mouseover"
      }
    },
    encoding: {
      x: {
        field: "period",
        bin: {
          binned: true,
          step: 1,
          maxbins: 10
        },
        title: null,
        type: "quantitative",
        axis: {
          format: "1",
          labelAngle: yearsDomain < 11 ? 45 : 0,
          labelFlush: false,
          labelOverlap: true
        },
        scale: {
          domain: [lowerBoundYear, thisYear]
        }
      },
      x2: {
        field: "bin_end"
      },
      y: {
        field: "count",
        type: "quantitative",
        axis: null
      },
      color: {
        field: "count",
        scale: { range: ["#1abc9c"] },
        type: "nominal",
        legend: null,
        condition: [{ selection: "highlight", value: "#34495e" }]
      }
    },
    config: {
      view: {
        stroke: null
      },
      axis: {
        grid: false
      }
    }
  }

  const mydata = data;

  const title = () => {
    const style = {
      color: '#1abc9c',
    }
    return (
      <small><Pluralize singular={'Work'} count={doiCount} style={style} />  reported.</small>
    )
  }

  return (
    <div className="panel panel-transparent">
      <div className="production-chart panel-body">
        <Grid>
          <Row>
            {title()}
          </Row>
          <Row>
            <VegaLite renderer="svg" spec={spec} data={{ table: mydata }} actions={actions} />
          </Row>
        </Grid>
      </div>
    </div>
  );
}

export default ProductionChart