import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import './VeloMeshDeepDive.css';

const source = 'https://github.com/RitvikChunamari/velomesh/blob/8197f5cdb3e365568a8f7ea25c7ec60db4c59b3c/';
const chapters = [
  { id: 'workflow', title: 'From product intent to an execution plan' },
  { id: 'architecture', title: 'Inside the orchestration layer' },
  { id: 'routing', title: 'The right route for the current task' },
  { id: 'capabilities', title: 'A capability library that can grow' },
  { id: 'continuity', title: 'Keep the work moving across hosts' },
  { id: 'experience', title: 'Making an invisible system tangible' },
  { id: 'verification', title: 'Evidence before completion' },
  { id: 'tradeoffs', title: 'Engineering decisions & tradeoffs' },
];

function SourceLink({ file, children }: { file: string; children: React.ReactNode }) {
  return <a className="vm-source" href={`${source}${file}`} target="_blank" rel="noopener noreferrer">{children}<ArrowUpRight size={16} aria-hidden="true" /></a>;
}
function Chapter({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="vm-chapter" id={`velomesh-${id}`} aria-labelledby={`velomesh-${id}-title`}>
    <h3 id={`velomesh-${id}-title`}>{title}</h3><div className="vm-chapter-body">{children}</div>
  </section>;
}

export default function VeloMeshDeepDive() {
  return <div className="vm-deep-dive">
    <nav className="vm-contents" aria-label="VeloMesh case study sections">
      <h3>Explore the product</h3>
      <ol>{chapters.map(chapter => <li key={chapter.id}><a href={`#velomesh-${chapter.id}`}>{chapter.title}</a></li>)}</ol>
    </nav>

    <Chapter {...chapters[0]}>
      <p className="vm-lead">The core product decision is to separate what someone wants to build from how an AI assistant assembles the tools to build it.</p>
      <p>VeloMesh is aimed at developers and product builders who work across coding assistants. Instead of repeatedly choosing a model, finding a skill, and configuring a connector, they describe the audience, the important workflows, and the design or technology constraints. The orchestration layer turns that brief into recommendations the active host can act on.</p>
      <ol className="vm-flow">
        <li><strong>Describe</strong><span>Audience, workflows, constraints, and visual direction.</span></li>
        <li><strong>Clarify</strong><span>Identify missing product signals before implementation.</span></li>
        <li><strong>Compose</strong><span>Recommend specialists, skills, and a sequence of work.</span></li>
        <li><strong>Verify</strong><span>Run checks and review the resulting evidence.</span></li>
      </ol>
      <p>The vision check uses word counts and keyword groups to recognize domain, feature, and stack signals. A brief such as “build an app” asks too little of the user; a brief describing a treasury dashboard, its users, data flows, and visual references gives the system more to work with. This is a practical heuristic, not a guarantee that every requirement has been understood.</p>
      <SourceLink file="scripts/router.mjs">Explore task planning and the vision check</SourceLink>
    </Chapter>

    <Chapter {...chapters[1]}>
      <p>There are two complementary paths through the product. The Python CLI manages the capability library and host setup. The Node.js runtime exposes orchestration tools, selects model routes, coordinates work, and serves model-compatible endpoints.</p>
      <div className="vm-modules">
        <details open><summary>Capability engine / Python</summary><p>Indexes local skills, recommends a full-stack bundle, searches for missing capabilities, and links selected skills into supported host directories. If symbolic links are unavailable, the installer can copy a managed directory instead.</p><code>scripts/velomesh.py</code></details>
        <details><summary>Control surface / MCP</summary><p>The MCP server exposes task routing, model selection, project plans, handoff records, worker execution, and verification as tools. This makes the orchestration layer callable from a host without requiring a separate product interface for every operation.</p><code>scripts/mcp-server.mjs</code></details>
        <details><summary>Inference path / local gateway</summary><p>The gateway accepts OpenAI-style chat completions and Responses requests as well as Anthropic-style Messages requests. It resolves a route and attempts configured upstreams. The tested gateway surface includes JSON and streaming responses for the OpenAI-compatible endpoints.</p><code>scripts/gateway.mjs</code></details>
        <details><summary>Coordination / local state</summary><p>Project-scoped JSON records retain stages, owners, notes, and events. Atomic writes and lock directories reduce concurrent update conflicts. Stage transitions check declared dependencies and overlapping file ownership before work starts.</p><code>scripts/state.mjs</code></details>
      </div>
      <SourceLink file="scripts/mcp-server.mjs">Inspect the MCP tool surface</SourceLink>
    </Chapter>

    <Chapter {...chapters[2]}>
      <p className="vm-lead">A stable model alias can hide a changing execution route.</p>
      <p><code>velomesh/auto</code> classifies each task into architecture, frontend, implementation, fast triage, or review. Dedicated aliases let a caller pin architecture, frontend, fast, or review behavior. The implementation uses explicit intent rules and an ordered candidate catalog, making routing decisions inspectable rather than learned or opaque.</p>
      <dl className="vm-facts">
        <div><dt>Selection</dt><dd>Match the task phase, then examine configured API providers, compatible local routers, and installed CLI options. A decision includes the model, transport, reason, confidence, and fallback chain.</dd></div>
        <div><dt>Independent review</dt><dd>When a previous model family is supplied, review routing favors a different family. This creates a mechanism for a second perspective; it does not itself prove that the review is correct.</dd></div>
        <div><dt>Fallback</dt><dd>The gateway attempts the chosen route and alternatives when calls fail. If upstreams are unavailable or unauthenticated, it returns a deterministic orchestration trace marked as simulator transport rather than a completed software build.</dd></div>
        <div><dt>Provider mapping</dt><dd>The requested model and actual upstream model are distinct fields. A local router may map a preferred model name to one it supports, so the route should be read alongside the executed transport and upstream identity.</dd></div>
      </dl>
      <SourceLink file="scripts/model-router.mjs">Read model-selection rules</SourceLink>
      <SourceLink file="scripts/gateway.mjs">Follow gateway execution and fallback</SourceLink>
    </Chapter>

    <Chapter {...chapters[3]}>
      <p>Capability discovery starts close to the developer. VeloMesh first checks whether a requested skill is already installed, then considers local recommendations. When a local match is insufficient, it searches repositories by capability type: skill, MCP server, API, or agent.</p>
      <p>Repositories containing skill definitions can be copied into the local library and linked to selected hosts. A repository without a skill definition can receive a generated wrapper containing its source, purpose, and a documentation excerpt. That wrapper makes the capability discoverable; it is not evidence that an external service is authenticated, running, or fully integrated.</p>
      <dl className="vm-facts">
        <div><dt>Full-stack coverage</dt><dd>The bundle organizes recommendations around interface design, motion, backend APIs, database state, security, and verification. The value is the connection between layers, rather than adding every tool to every task.</dd></div>
        <div><dt>Preserve local work</dt><dd>Linking distinguishes managed directories from existing unmanaged skill folders. Custom user content is preserved instead of being silently replaced during normal linking.</dd></div>
        <div><dt>Trace the source</dt><dd>The manifest records repository and revision information for installed skills. Metadata-only wrappers are distinguishable from capabilities installed from a repository checkout.</dd></div>
      </dl>
      <SourceLink file="scripts/velomesh.py">Inspect discovery, installation, and linking</SourceLink>
    </Chapter>

    <Chapter {...chapters[4]}>
      <p>Long-running work needs more than a prompt history. VeloMesh keeps an explicit objective, stages, dependencies, assigned owners, and claimed files. A stage cannot enter progress while its dependencies are unfinished or another active stage claims the same file.</p>
      <p>For host-to-host continuity, a portable “passport” packages the goal, decisions, constraints, verification notes, and next steps. A SHA-256 checksum detects payload changes. Import treats the document as untrusted project context—not permission to run commands—and export uses a private local directory.</p>
      <dl className="vm-facts">
        <div><dt>Advisory workers</dt><dd>CLI adapters can ask Claude, Codex, Gemini, or OpenCode for analysis. Worker execution is explicitly gated, time-bounded, output-bounded, and subject to a daily attempt budget.</dd></div>
        <div><dt>Implementation workers</dt><dd>Write-enabled execution creates an isolated Git worktree from a clean repository. The worker is directed to make the scoped change there. The branch is retained for review and is not automatically merged.</dd></div>
        <div><dt>Trust boundary</dt><dd>A worktree separates repository changes, not operating-system or network access. Likewise, a checksum establishes integrity, not the author’s identity. Native host permissions still matter.</dd></div>
      </dl>
      <SourceLink file="scripts/passport.mjs">Inspect portable handoffs</SourceLink>
      <SourceLink file="scripts/workers.mjs">Inspect worker execution boundaries</SourceLink>
    </Chapter>

    <Chapter {...chapters[5]}>
      <p className="vm-lead">The public website gives a visible form to a system that usually operates inside an editor.</p>
      <p>The product experience walks through stack layers, model orchestration, execution stages, and the product-vision check. Its workbench connects a sample brief with files, skill labels, and an embedded demo. Switching layers helps a visitor relate an abstract capability such as database design to a concrete artifact.</p>
      <p>The current workbench contains prepared blueprints for PulseLedger, a treasury product, and Kinetix, a collaborative shader and UI studio. The code panel and verification text come from those blueprint definitions. They explain the intended workflow; they are not fresh generation or a new test run triggered by typing into the page.</p>
      <p>This distinction shapes the portfolio story: the website demonstrates the interaction model, while the CLI, gateway, MCP server, and repository tests provide the implementation evidence behind it.</p>
      <SourceLink file="web/app.js">Explore the workbench implementation</SourceLink>
    </Chapter>

    <Chapter {...chapters[6]}>
      <p>Verification produces a record that can be inspected after a task completes. The local checker runs a fixed set of commands and stores a receipt with the check name, workspace identity, exit code, duration, output, and timeout or truncation status.</p>
      <dl className="vm-facts">
        <div><dt>Check semantics</dt><dd>Git diff checks detect formatting problems and are marked non-qualifying. Node and npm test runs are qualifying checks, but executing project test code requires an explicit opt-in. Passing a formatting check is not treated as passing the test suite.</dd></div>
        <div><dt>Protocol coverage</dt><dd>Gateway tests exercise routing decisions, cross-family review selection, model listings, compatible request endpoints, and JSON or streaming responses. MCP tests and fault-injection tests cover tool behavior and invalid requests.</dd></div>
        <div><dt>Installation coverage</dt><dd>Python tests cover skill detection, name sanitization, linking, preservation of custom folders, corrupted inputs, rate-limit handling, host configuration, and full-stack bundle recommendations.</dd></div>
        <div><dt>Continuity evidence</dt><dd>The handoff fixture uses a small repository with a failing baseline, a receiver worktree, a verification receipt, and a final report. Its report explicitly separates simulated host continuity from live provider integration.</dd></div>
      </dl>
      <p>These are the checks represented in the reviewed source. They establish the intended test surface, not a claim that every provider, host, or generated product has been validated end to end.</p>
      <SourceLink file="scripts/verification.mjs">Read the verification-receipt implementation</SourceLink>
      <SourceLink file="tests/gateway.test.mjs">Read gateway test cases</SourceLink>
    </Chapter>

    <Chapter {...chapters[7]}>
      <dl className="vm-facts">
        <div><dt>One interface, several hosts</dt><dd>MCP tools and compatible gateway endpoints reduce the need for a bespoke integration in every editor. The tradeoff is uneven host support: configuration, native model pickers, permissions, and CLI behavior remain host-specific.</dd></div>
        <div><dt>Determinism over hidden inference</dt><dd>Keyword-based intent checks and ordered model candidates are easy to inspect and test. They can miss unusual phrasing or ambiguous requests, so explicit model aliases and product clarification remain useful controls.</dd></div>
        <div><dt>Local state over a hosted control plane</dt><dd>Plans, receipts, and handoffs can live on the developer’s machine without a central database service. Cross-machine continuity then needs an explicit export/import step; local files do not provide automatic distributed synchronization.</dd></div>
        <div><dt>Extensibility with provenance</dt><dd>Internet discovery broadens the available toolset, but a found repository is not automatically a trusted or operational dependency. Source tracking and the distinction between installed skills and synthesized wrappers help keep that boundary visible.</dd></div>
        <div><dt>Open source, separate inference costs</dt><dd>The project is MIT-licensed. Its gateway can use configured APIs, local routers, or coding CLIs, whose authentication, availability, subscriptions, and usage charges remain separate from the software license.</dd></div>
      </dl>
      <p>The resulting product is a coordination layer: it reduces repeated setup decisions and makes the path from intent to execution more explicit, while leaving product judgment, permission boundaries, and final acceptance with the person doing the work.</p>
    </Chapter>
  </div>;
}
