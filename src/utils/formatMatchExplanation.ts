
/**
 * Formats a match explanation string into sections for better readability
 */
export const formatMatchExplanation = (explanation?: string) => {
  if (!explanation) return { overview: "No explanation provided", sections: [] };
  
  // Extract overview (first sentence)
  const firstPeriodIndex = explanation.indexOf('.');
  const overview = firstPeriodIndex > 0 
    ? explanation.substring(0, firstPeriodIndex + 1) 
    : explanation;
  
  // Try to split the explanation into sections based on common patterns
  const sections = [];
  
  // Look for skills matches
  if (explanation.includes("skills")) {
    const skillsRegex = /([^.]*skills[^.]*\.)/i;
    const skillsMatch = explanation.match(skillsRegex);
    if (skillsMatch && skillsMatch[0]) {
      sections.push({
        title: "Skills Match",
        content: skillsMatch[0].trim()
      });
    }
  }
  
  // Look for experience matches
  if (explanation.includes("experience")) {
    const expRegex = /([^.]*experience[^.]*\.)/i;
    const expMatch = explanation.match(expRegex);
    if (expMatch && expMatch[0]) {
      sections.push({
        title: "Experience",
        content: expMatch[0].trim()
      });
    }
  }

  // Look for education mentions
  if (explanation.includes("education") || explanation.includes("degree")) {
    const eduRegex = /([^.]*education[^.]*(\.)|[^.]*degree[^.]*\.)/i;
    const eduMatch = explanation.match(eduRegex);
    if (eduMatch && eduMatch[0]) {
      sections.push({
        title: "Education",
        content: eduMatch[0].trim()
      });
    }
  }
  
  // If no sections were extracted or sections don't cover most of the content,
  // add the remaining text as an "Additional Factors" section
  if (sections.length === 0 || 
      sections.reduce((acc, section) => acc + section.content.length, 0) < explanation.length / 2) {
    sections.push({
      title: "Additional Factors",
      content: explanation.replace(overview, "").trim()
    });
  }
  
  return {
    overview,
    sections
  };
};

/**
 * Returns an appropriate color class based on match percentage
 */
export const getMatchColor = (percentage?: number) => {
  if (!percentage) return "bg-gray-200";
  if (percentage >= 80) return "bg-green-500";
  if (percentage >= 60) return "bg-blue-500";
  if (percentage >= 40) return "bg-yellow-500";
  return "bg-red-500";
};