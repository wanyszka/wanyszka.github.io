/* Global content registry. Content files push exams into ORF309.exams
   and set ORF309.playbook. Plain scripts (no modules) so the site also
   works when index.html is opened directly from disk. */
window.ORF309 = window.ORF309 || { exams: [], playbook: null };

/* String.raw keeps backslashes intact so LaTeX can be written naturally:
   R`\(P\{A\}\)`  → the literal text \(P\{A\}\)                           */
window.R = String.raw;
