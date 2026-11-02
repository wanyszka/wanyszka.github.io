/* ================================================================
   The Playbook — recurring moves, and red flags from grading comments
   ================================================================ */
ORF309.playbook = {
  intro: R`Every midterm problem in this course is built from a small number of moves. The hard part on exam day is not executing a move; it is recognizing <em>which one the problem is asking for</em>. This page lists the moves, the signal in the problem text that calls for each, and the mistakes graders have flagged year after year.`,

  checklist: {
    title: 'Four questions to answer before you compute',
    items: [
      {
        q: 'What is the experiment, and what are the random objects?',
        a: R`Name events (yes/no statements, like \(C\) = “chose the Canadian coin”) and random variables (numbers, like \(N\) = “day of the first offer”). Write \(\P(A)\) for events and \(\P\{X = k\}\) for random variables; \(\P(X)\) is meaningless, and graders say so.`
      },
      {
        q: 'What kind of answer is being asked for?',
        a: R`A probability of an event; an expectation; a variance; a <em>distribution</em> (the pmf for every value, including the range); or a yes/no question such as independence, which must be verified from the definition. Each type has its own opening move.`
      },
      {
        q: 'What is given, in symbols, and what shape does it have?',
        a: R`Translate every sentence. Then look at the shape: facts given <em>conditionally</em> point to the law of total probability, Bayes or the chain rule; “independently each day” points to a Bernoulli process; “for each value of \(X\)” points to conditioning on \(X\).`
      },
      {
        q: 'Which move does that shape suggest?',
        a: R`Pick from the list below. Then, when you are done, run a sanity check: extreme parameter values, a pmf that sums to 1, an answer between 0 and 1, units that make sense.`
      }
    ]
  },

  moves: [
    {
      id: 'mv-ltp',
      figure: { name: 'area', opts: { eventName: 'A', cases: [{ name: 'E_1', prob: 0.6, cond: 0.3, label: '0.6', condLabel: '0.3' }, { name: 'E_2', prob: 0.4, cond: 0.7, label: '0.4', condLabel: '0.7' }] } },
      title: 'Law of total probability / total expectation',
      when: R`a quantity is known <em>case by case</em> (given a coin, a drink, a value of \(X\)) and you need it overall.`,
      html: R`<p>Choose the partition that matches the conditionals you were handed. If the data says \(\P(C \given A \cap B)\), \(\P(C \given A \cap B^c)\), …, the partition is the four cells \(A \cap B, A \cap B^c, \dots\), not \(\{A, A^c\}\).</p>`,
      template: R`\[\P(A) = \sum_i \P(A \given E_i)\,\P(E_i),\] \[\E[X] = \sum_i \E[X \given E_i]\,\P(E_i),\] <p>for a partition \(E_1, E_2, \dots\) (disjoint, union \(\Omega\)). Over the values of a random variable: \(\P(A) = \sum_k \P(A \given Y = k)\P\{Y = k\}\).</p>`,
      trap: R`<p>Adding bare conditionals, \(\P(A) = \P(A \given E_1) + \P(A \given E_2)\), without the weights \(\P(E_i)\). Or using a “partition” whose pieces overlap.</p>`,
      seen: ['f2026/p1', 'f2026/p4', 'f2023/p1', 'f2023/p3', 'f2022/p2']
    },
    {
      id: 'mv-bayes',
      figure: { name: 'area', opts: { eventName: 'B', bayes: 0, cases: [{ name: 'A', prob: 0.3, cond: 0.8, label: '0.3', condLabel: '0.8' }, { name: 'A^c', prob: 0.7, cond: 0.2, label: '0.7', condLabel: '0.2' }], slider: { label: 'P(A)', min: 0.05, max: 0.95, value: 0.3, sets: [[0, 'prob']] } } },
      title: 'Bayes: reverse the conditioning',
      when: R`the data gives \(\P(B \given A)\) and the question asks for \(\P(A \given B)\) (“given that you fell asleep, what is the probability you had juice?”).`,
      html: R`<p>Do not memorize it; derive it from the definition of conditional probability twice. The denominator is almost always what the previous part of the problem computed.</p>`,
      template: R`\[\P(A \given B) = \frac{\P(A \cap B)}{\P(B)} = \frac{\P(B \given A)\,\P(A)}{\P(B)}.\]`,
      trap: R`<p>Confusing \(\P(A \given B)\) with \(\P(B \given A)\). Arguing that \(\P(A \given B) = \P(A)\) “because \(A\) happened first”: conditioning is about information, not time order.</p>`,
      seen: ['f2026/p1', 'f2023/p1']
    },
    {
      id: 'mv-chain',
      figure: { name: 'tree', opts: {} },
      title: 'Chain (multiplication) rule',
      when: R`the givens arrive as a sequence of conditionals, each conditioned on everything before it: \(\P(A)\), then \(\P(B \given A)\), then \(\P(C \given A \cap B)\).`,
      html: R`<p>The events are dependent and the conditionals <em>are</em> the dependence. No independence is needed or assumed.</p>`,
      template: R`\[\P(A \cap B \cap C) = \P(C \given A \cap B)\,\P(B \given A)\,\P(A).\]`,
      trap: R`<p>Writing \(\P(A \cap B \cap C) = \P(A)\P(B)\P(C)\) when the problem explicitly says the events are dependent. Mixing up which conditional belongs to which cell (\(b = \P(B \given A)\) versus \(c = \P(B \given A^c)\)).</p>`,
      seen: ['f2026/p4', 'f2023/p1', 'f2022/p1']
    },
    {
      id: 'mv-indicators',
      figure: { name: 'indicators', opts: { n: 8, p: 0.5, q: null, labelA: 'the event', pTex: 'p', nTex: 'n' } },
      title: 'Counts are sums of indicators',
      when: R`the question says “expected number of … that …”.`,
      html: R`<p>Write the count as \(X = \sum_i \ind_{A_i}\). Then \(\E[X] = \sum_i \P(A_i)\) by linearity, which needs <em>no</em> independence. For variances you need independence (or covariances); for an indicator, \(\ind_A^2 = \ind_A\) gives \(\Var(\ind_A) = \P(A)(1 - \P(A))\).</p>`,
      template: R`\[\E\Big[\sum_i \ind_{A_i}\Big] = \sum_i \P(A_i),\] \[\Var\Big(\sum_i \ind_{A_i}\Big) = \sum_i \P(A_i)(1 - \P(A_i)) \;\text{ if independent.}\]`,
      trap: R`<p>Justifying \(\E[X] = np\) by “Binomial” when the trials were not stated to be independent (graders call this an incorrect justification). Adding variances “by linearity”.</p>`,
      seen: ['f2026/p3', 'f2023/p3']
    },
    {
      id: 'mv-disjoint',
      figure: { name: 'lattice', opts: { p: 0.4, n: 8, k: 5 } },
      title: 'Disjoint union + third axiom + geometric series',
      when: R`you need the probability of “\(X = Y\)”, “\(X < Y\)”, “\(X + Y = k\)”, or “\(A\) eventually happens”.`,
      html: R`<p>Index the pieces by the value of one variable (or by the round in which something happens). Inside each piece use independence (a product); across pieces use disjointness (a sum). Then recognize the sum, usually \(\sum_{n \ge 1} r^{n-1} = \frac{1}{1 - r}\) or \(\sum_{n \ge 1} n r^{n-1} = \frac{1}{(1-r)^2}\), and note \(0 < r < 1\).</p>`,
      template: R`\[\P\{X < Y\} = \sum_{k \ge 1} \P\{X = k\}\,\P\{Y > k\},\] \[\P\{X + Y = k\} = \sum_{n} \P\{X = n\}\,\P\{Y = k - n\}.\]`,
      trap: R`<p>Starting the sum at \(n = 0\) for geometric variables (they start at 1). Forgetting the range of the result (\(k \ge 2\) for a sum of two geometrics). Leaving a geometric series unsummed. Justifying the sum by “independence” instead of disjointness.</p>`,
      seen: ['f2026/p5', 'f2022/p3', 'f2023/p3']
    },
    {
      id: 'mv-find-independence',
      figure: { name: 'timeline', opts: { n: 10, p: 0.35 } },
      title: 'Find the independence',
      when: R`a condition seems to “get in the way” of a Bernoulli or Poisson process computation, or you need the distribution of a minimum.`,
      html: R`<p>Rewrite the question so that the random pieces depend on <em>disjoint</em> sets of trials: increments \(S_{10} - S_4\) versus the early trials; tails \(\{N > k\} \cap \{M > k\}\) for a minimum. Then independence of the trials lets you factor, or drop the condition entirely.</p>`,
      template: R`\[\P\{\min(N, M) > k\} = \P\{N > k\}\,\P\{M > k\},\] \[\P\{S_{10} - S_4 \in B \given T_1 = 4\} = \P\{S_{10} - S_4 \in B\}.\]`,
      trap: R`<p>Dropping a condition without checking which trials each object depends on (\(S_{10}\) is <em>not</em> independent of \(\{T_1 = 4\}\)). Treating “same distribution” as “same random variable”.</p>`,
      seen: ['f2026/p2', 'f2026/p5']
    },
    {
      id: 'mv-recognize',
      title: 'Recognize the distribution, and justify it',
      when: R`you see “each day/trial independently with probability \(p\)”.`,
      html: R`<p>Counts of successes in \(n\) trials are \(\Binom(n, p)\); the time of the first success is \(\Geom(p)\) on \(\{1, 2, \dots\}\) with mean \(1/p\); the time of the \(k\)-th success is negative binomial with mean \(k/p\); times between successes are independent \(\Geom(p)\). Continuous analogue: \(\Exp(\mu)\) with \(\P\{T > t\} = e^{-\mu t}\). State the trials, their independence and the common \(p\); the name alone is not a justification.</p>`,
      template: R`\[\P\{\Binom(n,p) = k\} = \binom nk p^k q^{n-k},\] \[\P\{\Geom(p) = k\} = q^{k-1}p, \qquad \P\{\Geom(p) > k\} = q^k.\]`,
      trap: R`<p>Binomial with a non-integer number of trials (\(\Binom(5 - \E[Z_1], 0.1)\)). Geometric starting at 0. Confusing the rate \(\mu\) of an exponential with its mean \(1/\mu\). Reading \(\{N \le 3\}\) when the story says \(\{N = 3\}\).</p>`,
      seen: ['f2026/p2', 'f2023/p2', 'f2023/p3', 'f2022/p2']
    },
    {
      id: 'mv-moments',
      figure: { name: 'jensen', opts: {} },
      title: 'Expectations of functions: LOTUS and second moments',
      when: R`a sum \(\sum_k \varphi(k)\P\{X = k\}\) appears, or a probability depends on \(X\) through a nonlinear function.`,
      html: R`<p>\(\sum_k \varphi(k)\P\{X = k\}\) <em>is</em> \(\E[\varphi(X)]\); with \(\varphi(k) = k^2\) it is the second moment, available as \(\Var(X) + (\E[X])^2\) for any named distribution. Never replace \(X\) by \(\E[X]\) inside \(\varphi\), inside an event, or inside another distribution.</p>`,
      template: R`\[\E[\varphi(X)] = \sum_k \varphi(k)\,\P\{X = k\},\] \[\E[X^2] = \Var(X) + (\E[X])^2.\]`,
      trap: R`<p>\((\E[X])^2\) in place of \(\E[X^2]\). \(\P\{T > 3\}\) computed as “is \(\E[T] > 3\)?”. Squaring a sum instead of summing squares.</p>`,
      seen: ['f2022/p2', 'f2026/p3', 'f2023/p2']
    },
    {
      id: 'mv-conditional-expectation',
      figure: { name: 'renormalize', opts: { outcomes: [{ label: '000', w: 1, removed: true }, { label: '001', w: 1 }, { label: '010', w: 1 }, { label: '011', w: 1 }, { label: '100', w: 1 }, { label: '101', w: 1 }, { label: '110', w: 1 }, { label: '111', w: 1 }] } },
      title: 'Conditional expectation given an event',
      when: R`you are asked for an expectation “given that …”.`,
      html: R`<p>Restrict to the event and renormalize: \(\E[X \given A] = \E[X \ind_A]/\P(A)\). Equivalently, use the conditional distribution \(\P(\omega \given A) = \P(\omega)/\P(A)\) for every outcome \(\omega \in A\). Inside a conditional expectation, every distribution is the conditional one: \(\E[K \given K \text{ odd}] = 3\), not \(3.5\).</p>`,
      template: R`\[\E[X \given A] = \frac{\E[X\,\ind_A]}{\P(A)} = \sum_x x\,\P\{X = x \given A\}.\]`,
      trap: R`<p>Forgetting to divide by \(\P(A)\). Rescaling only some outcomes after conditioning. Reusing unconditional means inside a conditional expectation.</p>`,
      seen: ['f2022/p1', 'f2026/p2', 'f2023/p2']
    },
    {
      id: 'mv-independence-check',
      title: 'Independence is verified, not felt',
      when: R`the question is “are these independent?”, or you are tempted to factor a probability.`,
      html: R`<p>Check \(\P(A \cap B) = \P(A)\P(B)\) (or \(\P(A \given B) = \P(A)\)). Disjoint events with positive probability are never independent. Events that are independent <em>given</em> a hidden variable (which coin, which drink) are generally dependent once the hidden variable is averaged out.</p>`,
      template: R`\[A \perp\!\!\!\perp B \iff \P(A \cap B) = \P(A)\,\P(B).\]`,
      trap: R`<p>“Independent because they feel unrelated” (or “because Princeton and New York are close”). Confusing conditional independence with independence. Claiming \(M\) and \(N\) are independent when both are defined on the same sequence of trials.</p>`,
      seen: ['f2026/p1', 'f2026/p5']
    },
    {
      id: 'mv-sanity',
      title: 'Sanity checks',
      when: R`always, in the last minute of each problem.`,
      html: R`<p>Plug in extreme parameters (\(p \to 0\), \(p \to 1\), \(p = \tfrac12\)) and compare with the story. Check a pmf sums to 1. Check a probability is in \([0, 1]\) and a variance is \(\ge 0\). Check units (hours versus minutes, hours² for a variance of hours). Check a special case where the answer is known (make the events independent and see the conditional collapse).</p>`,
      template: R`<p>Example: \(\P\{N < M\} = \frac{1-p}{2-p}\) gives \(0\) at \(p = 1\) (certain tie) and \(\tfrac12\) at \(p \to 0\) (ties negligible). ✓</p>`,
      trap: R`<p>Submitting \(2p\) as a probability that can exceed 1. A pmf that sums to \(1/p\). Converting a variance from hours to minutes by multiplying by 60 instead of \(60^2\).</p>`,
      seen: ['f2026/p1', 'f2026/p4', 'f2026/p5', 'f2022/p3']
    }
  ],

  redflags: [
    {
      no: R`\(\P(A) = \P(A \given E_1) + \P(A \given E_2)\)`,
      yes: R`\(\P(A) = \P(A \given E_1)\P(E_1) + \P(A \given E_2)\P(E_2)\). Conditionals are weighted; intersections add.`,
      src: 'Grading comments, Fall 2015 Q1, Fall 2023 Q1, Fall 2026 Q4.'
    },
    {
      no: R`Naming a Binomial and using \(\E[X] = np\) when the trials were never said to be independent; or citing “independence of the days” to justify linearity of expectation.`,
      yes: R`\(\E[\sum_i \ind_{A_i}] = \sum_i \P(A_i)\) by linearity, which needs no independence. Say “linearity”.`,
      src: 'Grading comments, Spring 2021 Q1(c).'
    },
    {
      no: R`\(\P\big(\bigcup_k B_k\big) = \sum_k \P(B_k)\) “by independence”.`,
      yes: R`That identity holds because the \(B_k\) are <em>mutually exclusive</em> (third axiom). Mutually exclusive is not independent.`,
      src: 'Grading comments, Fall 2015 Q3(c).'
    },
    {
      no: R`\(\E[P \given A^c] = \sum_{\omega \in A^c} P(\omega)\,\P\{\omega\}\)`,
      yes: R`Divide by \(\P(A^c)\): the conditional expectation renormalizes to the event.`,
      src: 'Grading comments, Fall 2022 Q1(b): “a very common mistake”.'
    },
    {
      no: R`“Ripe at the super bowl” computed as \(\P\{N \le 3\}\).`,
      yes: R`Re-read the story: edible only on the ripening day, so the event is \(\{N = 3\}\).`,
      src: 'Grading comments, Fall 2023 Q3(b): the most common mistake.'
    },
    {
      no: R`\(Z_2 \sim \Binom(5 - \E[Z_1], 0.1)\)`,
      yes: R`The number of trials is random. Condition: \(Z_2 \given Z_1 \sim \Binom(5 - Z_1, 0.1)\), then average.`,
      src: 'Grading comments, Fall 2023 Q3(b).'
    },
    {
      no: R`“The sum of two geometrics is negative binomial, so …” with no derivation.`,
      yes: R`Derive the pmf from the disjoint union \(\bigcup_{n=1}^{k-1}\{S_1 = n, S_2 = k - n\}\), and state the range \(k \ge 2\).`,
      src: 'Grading comments, Fall 2022 Q3(b).'
    },
    {
      no: R`\(\P\{M = i, N = j\} = \P\{M = i\}\P\{N = j\}\) for the first failure \(M\) and first success \(N\) of the same trials.`,
      yes: R`They are defined on the same process and are dependent (\(M = 5\) forces \(N = 1\)). Work out the joint distribution by cases, including the zero cases.`,
      src: 'Grading comments, Spring 2017 Q1(c).'
    },
    {
      no: R`Fixing the random day \(N = n\) of the first vaccine and computing with \(n\) as a constant.`,
      yes: R`\(N\) is random: condition on \(N = n\) and sum with the law of total probability, \(\sum_n \P(A \given N = n)\P\{N = n\}\).`,
      src: 'Grading comments, Spring 2021 Q3(c): 4 points off.'
    },
    {
      no: R`\((\E[X])^2\) where \(\E[X^2]\) is needed; \(\big(\sum_k \tfrac{k}{100}\P\{X = k\}\big)^2\) instead of \(\sum_k (\tfrac{k}{100})^2\P\{X = k\}\).`,
      yes: R`Recognize \(\sum_k k^2\P\{X = k\} = \E[X^2] = \Var(X) + (\E[X])^2\).`,
      src: 'Grading comments, Fall 2022 Q2(b): “very few students were able to complete part b”.'
    },
    {
      no: R`Plugging \(t = 30\) or \(t = 50\) into a CDF given in hours; converting a variance in hours² by multiplying by 60.`,
      yes: R`Keep every time in the units of the given random variable. Variance scales by the square of the unit conversion.`,
      src: 'Grading comments, Fall 2015 Q2 and Spring 2017 Q2.'
    },
    {
      no: R`“The events are independent because Princeton and New York are geographically close.”`,
      yes: R`Compute \(\P(A \cap B)\) and \(\P(A)\P(B)\) and compare. Independence is a numerical identity.`,
      src: 'Grading comments, Spring 2021 Q2(b).'
    },
    {
      no: R`\(\P\{M > 8\} = 1 - \sum_{m=1}^8 p^{m-1}(1-p)\), left unsummed.`,
      yes: R`Sum the geometric series; or better, notice \(\{M > 8\}\) is “8 successes in a row”, probability \(p^8\).`,
      src: 'Grading comments, Spring 2017 Q1(a).'
    },
    {
      no: R`Writing \(\P(D)\) for a random variable \(D\); using random variables that were never defined.`,
      yes: R`Events get \(\P(A)\); random variables get \(\P\{D = d\}\). Define every symbol before using it.`,
      src: 'Grading comments, Fall 2015 Q1 and Q3.'
    },
    {
      no: R`\(\P\{S_P \in [1,2), S_N \in [1,2)\} = \P\{S_P \ge 1, S_N \ge 1\} - \P\{S_P \ge 2, S_N \ge 2\}\)`,
      yes: R`Draw the region: \(\{S_P \ge 1, S_N \ge 1\}\) minus the union \(\{S_P \ge 2\} \cup \{S_N \ge 2\}\) (intersected with the first), which needs inclusion–exclusion.`,
      src: 'Grading comments, Spring 2021 Q2(c).'
    },
    {
      no: R`Answering \(\P(T \le 1)\) when the question asked for \(\P(T > 1)\).`,
      yes: R`Answer the question that was asked, in the form it was asked. Re-read the question before writing the final box.`,
      src: 'Grading comments, Spring 2019 Q3(a).'
    }
  ]
};
