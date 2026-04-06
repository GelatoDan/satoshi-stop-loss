from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from xml.sax.saxutils import escape
import zipfile


OUTFILE = Path("working/ssl-execution-liquidity-model-2026-04-05.xlsx")


@dataclass
class Cell:
    value: object | None = None
    style: int = 0
    kind: str = "n"  # n, s, f


def col_letter(index: int) -> str:
    result = ""
    while index:
        index, rem = divmod(index - 1, 26)
        result = chr(65 + rem) + result
    return result


def str_cell(value: str, style: int = 0) -> Cell:
    return Cell(value=value, style=style, kind="s")


def num_cell(value: float | int, style: int = 0) -> Cell:
    return Cell(value=value, style=style, kind="n")


def formula_cell(formula: str, style: int = 0) -> Cell:
    return Cell(value=formula, style=style, kind="f")


def make_sheet_xml(rows: list[list[Cell | None]], widths: list[float] | None = None) -> str:
    max_row = len(rows)
    max_col = max((len(r) for r in rows), default=1)
    dim = f"A1:{col_letter(max_col)}{max_row}"

    parts = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
        f'<dimension ref="{dim}"/>',
        '<sheetViews><sheetView workbookViewId="0"/></sheetViews>',
        '<sheetFormatPr defaultRowHeight="15"/>',
    ]

    if widths:
        cols = []
        for i, width in enumerate(widths, start=1):
            cols.append(
                f'<col min="{i}" max="{i}" width="{width}" customWidth="1"/>'
            )
        parts.append(f"<cols>{''.join(cols)}</cols>")

    parts.append("<sheetData>")
    for r_idx, row in enumerate(rows, start=1):
        cells_xml: list[str] = []
        for c_idx, cell in enumerate(row, start=1):
            if cell is None or cell.value is None:
                continue
            ref = f"{col_letter(c_idx)}{r_idx}"
            style_attr = f' s="{cell.style}"' if cell.style else ""
            if cell.kind == "s":
                text = escape(str(cell.value))
                cells_xml.append(
                    f'<c r="{ref}" t="inlineStr"{style_attr}><is><t>{text}</t></is></c>'
                )
            elif cell.kind == "f":
                formula = str(cell.value)
                if formula.startswith("="):
                    formula = formula[1:]
                formula = escape(formula)
                cells_xml.append(f'<c r="{ref}"{style_attr}><f>{formula}</f></c>')
            else:
                cells_xml.append(f'<c r="{ref}"{style_attr}><v>{cell.value}</v></c>')
        parts.append(f'<row r="{r_idx}">{"".join(cells_xml)}</row>')
    parts.append("</sheetData></worksheet>")
    return "".join(parts)


def build_piecewise_impact_formula(exposure_ref: str) -> str:
    d10 = "'Venue Depth'!B13"
    d25 = "'Venue Depth'!C13"
    d50 = "'Venue Depth'!D13"
    d100 = "'Venue Depth'!E13"
    slope = "Assumptions!B10"
    return (
        f'=IF({exposure_ref}<=0,0,'
        f'IF({exposure_ref}<={d10},0.001*{exposure_ref}/{d10},'
        f'IF({exposure_ref}<={d25},0.001+(0.0025-0.001)*({exposure_ref}-{d10})/({d25}-{d10}),'
        f'IF({exposure_ref}<={d50},0.0025+(0.005-0.0025)*({exposure_ref}-{d25})/({d50}-{d25}),'
        f'IF({exposure_ref}<={d100},0.005+(0.01-0.005)*({exposure_ref}-{d50})/({d100}-{d50}),'
        f'0.01+({slope}*0.01)*(({exposure_ref}-{d100})/{d100}))))))'
    )


def workbook_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        '<sheets>'
        '<sheet name="Summary" sheetId="1" r:id="rId1"/>'
        '<sheet name="Assumptions" sheetId="2" r:id="rId2"/>'
        '<sheet name="Venue Depth" sheetId="3" r:id="rId3"/>'
        '<sheet name="Scenarios" sheetId="4" r:id="rId4"/>'
        '</sheets>'
        '<calcPr calcId="181029" calcMode="auto" fullCalcOnLoad="1"/>'
        '</workbook>'
    )


def workbook_rels_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
        'Target="worksheets/sheet1.xml"/>'
        '<Relationship Id="rId2" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
        'Target="worksheets/sheet2.xml"/>'
        '<Relationship Id="rId3" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
        'Target="worksheets/sheet3.xml"/>'
        '<Relationship Id="rId4" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
        'Target="worksheets/sheet4.xml"/>'
        '<Relationship Id="rId5" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
        'Target="styles.xml"/>'
        '</Relationships>'
    )


def root_rels_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="xl/workbook.xml"/>'
        '<Relationship Id="rId2" '
        'Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" '
        'Target="docProps/core.xml"/>'
        '<Relationship Id="rId3" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" '
        'Target="docProps/app.xml"/>'
        '</Relationships>'
    )


def content_types_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/worksheets/sheet1.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        '<Override PartName="/xl/worksheets/sheet2.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        '<Override PartName="/xl/worksheets/sheet3.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        '<Override PartName="/xl/worksheets/sheet4.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        '<Override PartName="/xl/styles.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        '<Override PartName="/docProps/core.xml" '
        'ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        '</Types>'
    )


def styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="1">
    <numFmt numFmtId="164" formatCode="$#,##0.00"/>
  </numFmts>
  <fonts count="2">
    <font>
      <sz val="11"/>
      <color theme="1"/>
      <name val="Calibri"/>
      <family val="2"/>
      <scheme val="minor"/>
    </font>
    <font>
      <b/>
      <sz val="11"/>
      <color theme="1"/>
      <name val="Calibri"/>
      <family val="2"/>
      <scheme val="minor"/>
    </font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="7">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
    <xf numFmtId="10" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
    <xf numFmtId="4" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>
    <xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/>
    <xf numFmtId="10" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>"""


def app_xml() -> str:
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        '<Application>Codex</Application>'
        '</Properties>'
    )


def core_xml() -> str:
    timestamp = datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        '<dc:creator>Codex</dc:creator>'
        '<cp:lastModifiedBy>Codex</cp:lastModifiedBy>'
        '<dcterms:created xsi:type="dcterms:W3CDTF">'
        f"{timestamp}</dcterms:created>"
        '<dcterms:modified xsi:type="dcterms:W3CDTF">'
        f"{timestamp}</dcterms:modified>"
        '</cp:coreProperties>'
    )


summary_rows: list[list[Cell | None]] = [
    [str_cell("Satoshi Stop Loss - Execution Liquidity Model", 1)],
    [str_cell("Assumption-based model for fast execution using a dedicated capital pool equal to 3% of insured value.")],
    [],
    [str_cell("Key outputs", 1), None, str_cell("Notes", 1)],
    [str_cell("Capital pool as % of insured value"), formula_cell("=Assumptions!B6", 3), str_cell("Editable in Assumptions sheet")],
    [str_cell("BTC share of insured value"), formula_cell("=Assumptions!B5", 3), str_cell("Used to convert insured value into BTC-exposed notional")],
    [str_cell("Effective executable depth at 25 bps"), formula_cell("='Venue Depth'!C13", 2), str_cell("Aggregate visible depth after participation, haircut, and market multiplier")],
    [str_cell("Effective executable depth at 50 bps"), formula_cell("='Venue Depth'!D13", 2), str_cell("Base fast-sweep capacity before residual warehousing")],
    [str_cell("Effective executable depth at 100 bps"), formula_cell("='Venue Depth'!E13", 2), str_cell("Upper end of immediate sweep used in this model")],
    [],
    [str_cell("Max insured value supported at 50 bps + pool"), formula_cell("='Venue Depth'!D13/(Assumptions!B5-Assumptions!B6)", 2), str_cell("Solves insured * BTC share <= depth + insured * pool %")],
    [str_cell("Max insured value supported at 100 bps + pool"), formula_cell("='Venue Depth'!E13/(Assumptions!B5-Assumptions!B6)", 2), str_cell("Useful rough upper bound for the 'fast as possible' design")],
    [],
    [str_cell("Illustrative example", 1)],
    [str_cell("Insured value"), num_cell(200000000, 2)],
    [str_cell("BTC-exposed notional"), formula_cell("=B15*Assumptions!B5", 2)],
    [str_cell("Capital pool"), formula_cell("=B15*Assumptions!B6", 2)],
    [str_cell("Modeled market impact"), formula_cell(build_piecewise_impact_formula("B16"), 3)],
    [str_cell("Modeled slippage cost"), formula_cell("=B16*B18", 2)],
    [str_cell("Pool / slippage coverage ratio"), formula_cell("=IF(B19=0,0,B17/B19)", 4)],
    [str_cell("Residual beyond 100 bps depth"), formula_cell("=MAX(B16-'Venue Depth'!E12,0)", 2)],
    [str_cell("Residual uncovered after pool"), formula_cell("=MAX(B21-B17,0)", 2)],
    [str_cell("Execution readout"), formula_cell('=IF(AND(B20>=1,B22=0),"Fast-executable under model","Constrained under model")')],
]

assumption_rows: list[list[Cell | None]] = [
    [str_cell("Assumptions", 1)],
    [str_cell("Update the inputs in column B to change the model.")],
    [],
    [str_cell("Input", 1), str_cell("Value", 1), str_cell("Comment", 1)],
    [str_cell("BTC share of insured value"), num_cell(0.60, 3), str_cell("Share of insured value assumed to require BTC liquidation or hedge capacity")],
    [str_cell("Dedicated capital pool (% of insured value)"), num_cell(0.03, 3), str_cell("Fixed at 3% for this prototype")],
    [str_cell("Participation rate of visible liquidity"), num_cell(0.65, 3), str_cell("How much of quoted depth the protocol can realistically take in a fast sweep")],
    [str_cell("Venue reliability haircut"), num_cell(0.80, 3), str_cell("Haircut for stale quotes, fragmentation, and venue constraints")],
    [str_cell("Market stress multiplier"), num_cell(1.00, 3), str_cell("Set below 100% to model thinner books during shock conditions")],
    [str_cell("Extra impact beyond 100 bps depth"), num_cell(0.75, 4), str_cell("Each extra 1x of 100 bps depth adds another 75 bps of impact")],
    [],
    [str_cell("Interpretation notes", 1)],
    [str_cell("All venue depths in this workbook are illustrative placeholders, not live snapshots.")],
    [str_cell("Effective depth = raw venue depth x participation rate x venue reliability haircut x market stress multiplier.")],
    [str_cell("The fast-executable ceiling at a given depth solves insured x BTC share <= effective depth + insured x pool %.")],
    [str_cell("The slippage model interpolates between 10, 25, 50, and 100 bps depth points, then extrapolates beyond 100 bps.")],
]

venue_rows: list[list[Cell | None]] = [
    [str_cell("Venue Depth Assumptions", 1)],
    [str_cell("Illustrative raw depth in USD notional available to hit immediately across major venues.")],
    [],
    [str_cell("Venue", 1), str_cell("10 bps raw", 1), str_cell("25 bps raw", 1), str_cell("50 bps raw", 1), str_cell("100 bps raw", 1)],
    [str_cell("Binance"), num_cell(15000000, 2), num_cell(30000000, 2), num_cell(55000000, 2), num_cell(95000000, 2)],
    [str_cell("Coinbase"), num_cell(6000000, 2), num_cell(14000000, 2), num_cell(28000000, 2), num_cell(50000000, 2)],
    [str_cell("Bybit"), num_cell(5000000, 2), num_cell(12000000, 2), num_cell(24000000, 2), num_cell(42000000, 2)],
    [str_cell("OKX"), num_cell(4000000, 2), num_cell(10000000, 2), num_cell(20000000, 2), num_cell(36000000, 2)],
    [str_cell("Kraken"), num_cell(2000000, 2), num_cell(5000000, 2), num_cell(10000000, 2), num_cell(18000000, 2)],
    [str_cell("Bitstamp"), num_cell(1000000, 2), num_cell(2500000, 2), num_cell(5000000, 2), num_cell(9000000, 2)],
    [],
    [str_cell("Total raw depth", 1), formula_cell("=SUM(B5:B10)", 5), formula_cell("=SUM(C5:C10)", 5), formula_cell("=SUM(D5:D10)", 5), formula_cell("=SUM(E5:E10)", 5)],
    [str_cell("Effective total depth", 1), formula_cell("=B12*Assumptions!B7*Assumptions!B8*Assumptions!B9", 5), formula_cell("=C12*Assumptions!B7*Assumptions!B8*Assumptions!B9", 5), formula_cell("=D12*Assumptions!B7*Assumptions!B8*Assumptions!B9", 5), formula_cell("=E12*Assumptions!B7*Assumptions!B8*Assumptions!B9", 5)],
    [],
    [str_cell("Implied max insured value at depth + pool", 1)],
    [str_cell("Using 10 bps depth"), formula_cell("=B13/(Assumptions!B5-Assumptions!B6)", 2)],
    [str_cell("Using 25 bps depth"), formula_cell("=C13/(Assumptions!B5-Assumptions!B6)", 2)],
    [str_cell("Using 50 bps depth"), formula_cell("=D13/(Assumptions!B5-Assumptions!B6)", 2)],
    [str_cell("Using 100 bps depth"), formula_cell("=E13/(Assumptions!B5-Assumptions!B6)", 2)],
]

scenario_rows: list[list[Cell | None]] = [
    [str_cell("Scenario Table", 1)],
    [str_cell("Each row estimates what immediate execution looks like if the protocol tries to move as fast as possible using exchange depth plus the 3% capital pool.")],
    [],
    [
        str_cell("Scenario", 1),
        str_cell("Insured value", 1),
        str_cell("BTC exposed", 1),
        str_cell("Capital pool", 1),
        str_cell("Impact %", 1),
        str_cell("Impact bps", 1),
        str_cell("Slippage $", 1),
        str_cell("Pool / slippage", 1),
        str_cell("Residual >100bps", 1),
        str_cell("Pool used", 1),
        str_cell("Residual uncovered", 1),
        str_cell("Readout", 1),
    ],
]

scenario_values = [
    ("Pilot", 25000000),
    ("Small", 50000000),
    ("Launch", 100000000),
    ("Scaled", 150000000),
    ("Upper base range", 200000000),
    ("Stress edge", 250000000),
    ("Large", 500000000),
    ("Very large", 1000000000),
]

start_row = 5
for idx, (label, insured_value) in enumerate(scenario_values, start=start_row):
    exposure_ref = f"C{idx}"
    impact_formula = build_piecewise_impact_formula(exposure_ref)
    row = [
        str_cell(label),
        num_cell(insured_value, 2),
        formula_cell(f"=B{idx}*Assumptions!B5", 2),
        formula_cell(f"=B{idx}*Assumptions!B6", 2),
        formula_cell(impact_formula, 3),
        formula_cell(f"=E{idx}*10000", 4),
        formula_cell(f"=C{idx}*E{idx}", 2),
        formula_cell(f"=IF(G{idx}=0,0,D{idx}/G{idx})", 4),
        formula_cell(f"=MAX(C{idx}-'Venue Depth'!E13,0)", 2),
        formula_cell(f"=MIN(D{idx},I{idx})", 2),
        formula_cell(f"=MAX(I{idx}-J{idx},0)", 2),
        formula_cell(f'=IF(AND(H{idx}>=1,K{idx}=0),"Fast-executable","Constrained")'),
    ]
    scenario_rows.append(row)

scenario_rows.extend(
    [
        [],
        [str_cell("Reading the table", 1)],
        [str_cell("Fast-executable means the modeled slippage cost fits inside the 3% pool and any residual beyond 100 bps depth can be warehoused by that same pool.")],
        [str_cell("Constrained means the design would need slower execution, deeper external liquidity, derivatives hedging, or a larger dedicated capital pool.")],
    ]
)


def write_workbook() -> None:
    OUTFILE.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(OUTFILE, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", content_types_xml())
        zf.writestr("_rels/.rels", root_rels_xml())
        zf.writestr("docProps/app.xml", app_xml())
        zf.writestr("docProps/core.xml", core_xml())
        zf.writestr("xl/workbook.xml", workbook_xml())
        zf.writestr("xl/_rels/workbook.xml.rels", workbook_rels_xml())
        zf.writestr("xl/styles.xml", styles_xml())
        zf.writestr("xl/worksheets/sheet1.xml", make_sheet_xml(summary_rows, [42, 18, 52]))
        zf.writestr("xl/worksheets/sheet2.xml", make_sheet_xml(assumption_rows, [42, 16, 60]))
        zf.writestr("xl/worksheets/sheet3.xml", make_sheet_xml(venue_rows, [20, 18, 18, 18, 18]))
        zf.writestr(
            "xl/worksheets/sheet4.xml",
            make_sheet_xml(scenario_rows, [18, 16, 16, 16, 12, 12, 16, 14, 16, 14, 18, 18]),
        )


if __name__ == "__main__":
    write_workbook()
    print(f"Wrote {OUTFILE}")
