---
date: '2025-01-16T12:00:00+02:00'
ShowDate: false
draft: false
ShowBreadCrumbs: false
ShowWordCount: false
ShowReadingTime: false
ShowShareButtons: false
hidemeta: true
---

# Publications

Papers listed by type and year of publication or year of submission if unpublished.

---

## Preprints

### [Tighter performance theory of FedExProx](https://arxiv.org/abs/2410.15368)

**Authors:** **Wojciech Anyszka**, Kaja Gruntkowska, Alexander Tyurin, Peter Richtárik  
**Source:** arXiv:2410.15368, 2024.

<table class="publication-actions">
<tr>
<td><button class="action-btn" onclick="toggleContent('abstract1')">Abstract</button></td>
<td><button class="action-btn" onclick="toggleContent('bibtex1')">BibTeX</button></td>
<td><button class="action-btn" onclick="downloadFile('https://arxiv.org/pdf/2410.15368')">Download</button></td>
</tr>
</table>

<div id="abstract1" class="expandable-content" style="display: none;">
<strong>Abstract:</strong><br>
    We revisit FedExProx — a recently proposed distributed optimization method designed to enhance convergence properties of parallel proximal algorithms via extrapolation. In the process, we uncover a surprising flaw: its known theoretical guarantees on quadratic optimization tasks are no better than those offered by the vanilla Gradient Descent (GD) method. Motivated by this observation, we develop a novel analysis framework, establishing a tighter linear convergence rate for non-strongly convex quadratic problems. By incorporating both computation and communication costs, we demonstrate that FedExProx can indeed provably outperform GD, in stark contrast to the original analysis. Furthermore, we consider partial participation scenarios and analyze two adaptive extrapolation strategies — based on gradient diversity and Polyak stepsizes — again significantly outperforming previous results. Moving beyond quadratics, we extend the applicability of our analysis to general functions satisfying the Polyak-Łojasiewicz condition, outperforming the previous strongly convex analysis while operating under weaker assumptions. Backed by empirical results, our findings point to a new and stronger potential of FedExProx, paving the way for further exploration of the benefits of extrapolation in federated learning.
</div>

<div id="bibtex1" class="expandable-content" style="display: none;">
<strong>BibTeX:</strong><br>
<pre><code>@misc{anyszka2024tighterperformancetheoryfedexprox,
      title={Tighter Performance Theory of FedExProx},
      author={Wojciech Anyszka and Kaja Gruntkowska and Alexander Tyurin and Peter Richtárik},
      year={2024},
      eprint={2410.15368},
      archivePrefix={arXiv},
      primaryClass={math.OC},
      url={https://arxiv.org/abs/2410.15368},
}</code></pre>
</div>

---

## Theses


### [The Kepler Problem and Its Relation to Extremal Black Holes](https://fse.studenttheses.ub.rug.nl/31614/)

**Type:** Joint BSc thesis (Mathematics & Physics)  
**Advisers:** [Marcello Seri](https://scholar.google.com/citations?user=PZCJoksAAAAJ&hl=en) and  [Diederik Roest](https://scholar.google.com/citations?user=j9hleIYAAAAJ&hl=nl)  
**Institution:** University of Groningen

<table class="publication-actions">
<tr>
<td><button class="action-btn" onclick="toggleContent('abstract_thesis1')">Abstract</button></td>
<td><button class="action-btn" onclick="toggleContent('bibtex_thesis1')">BibTeX</button></td>
<td><button class="action-btn" onclick="downloadFile('https://fse.studenttheses.ub.rug.nl/31614/1/bPHYS_2023_AnyszkaWJ.pdf')">Download</button></td>
</table>

<div id="abstract_thesis1" class="expandable-content" style="display: none;">
<strong>Abstract:</strong><br>
This thesis explores the unique properties of the classical Kepler problem, including Bertrand's theorem, the connection between Kepler and harmonic oscillator potentials, and the existence of an additional conserved quantity — the Laplace–Runge–Lenz (LRL) vector. The role of symmetries in this context is explored. A comprehensive proof of Moser's construction is presented, establishing the correspondence between nonconstant geodesics on an n-dimensional sphere and Kepler orbits with negative energies. Relativistic corrections to two-body problems are investigated, with particular focus on an extremal test particle near an oppositely charged extremal Einstein–Maxwell–dilaton black hole. Notably, the absence of perihelion precession occurs only for a specific dilaton coupling, a = √3. Away from this value, the system corresponds to a perturbed Kepler problem.
</div>

<div id="bibtex_thesis1" class="expandable-content" style="display: none;">
<strong>BibTeX:</strong><br>
<pre><code>@bachelorsthesis{anyszka_kepler_black_holes,
  title  = {The Kepler Problem and Its Relation to Extremal Black Holes},
  author = {Anyszka, Wojciech},
  school = {University of Groningen},
  type   = {BSc Thesis},
  url    = {https://fse.studenttheses.ub.rug.nl/31614/}
}</code></pre>
</div>

---

### [Towards an Approximation Theory of Observable Operator Models](https://arxiv.org/abs/2404.12070)

**Type:** BSc thesis (Artificial Intelligence)  
**Advisers:** [Herbert Jaeger](https://scholar.google.com/citations?user=0uztVbMAAAAJ&hl=de)  
**Institution:** University of Groningen

<table class="publication-actions">
<tr>
<td><button class="action-btn" onclick="toggleContent('abstract_thesis2')">Abstract</button></td>
<td><button class="action-btn" onclick="toggleContent('bibtex_thesis2')">BibTeX</button></td>
<td><button class="action-btn" onclick="downloadFile('https://arxiv.org/pdf/2404.12070')">Download</button></td>
</tr>
</table>

<div id="abstract_thesis2" class="expandable-content" style="display: none;">
<strong>Abstract:</strong><br>
Observable operator models (OOMs) provide a powerful framework for modelling stochastic processes beyond hidden Markov models. This thesis develops a rigorous approximation theory for OOMs of infinite-dimensional processes. An inner product structure on the space of future distributions is established, and continuity of observable operators with respect to the induced 2-norm is proven. A fundamental obstruction to turning this space into a Hilbert space is identified, and a potential remedy is proposed, laying groundwork for future research on approximating infinite-dimensional observable operators.
</div>

<div id="bibtex_thesis2" class="expandable-content" style="display: none;">
<strong>BibTeX:</strong><br>
<pre><code>@bachelorsthesis{anyszka_oom_approximation,
  title  = {Towards an Approximation Theory of Observable Operator Models},
  author = {Anyszka, Wojciech},
  school = {University of Groningen},
  type   = {BSc Thesis},
  eprint = {2404.12070},
  archivePrefix = {arXiv},
  url    = {https://arxiv.org/abs/2404.12070}
}</code></pre>
</div>