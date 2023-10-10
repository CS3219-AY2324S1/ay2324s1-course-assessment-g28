enum Complexity {
  EASY,
  MEDIUM,
  HARD,
}

class Question {
  title: string;
  description: string;
  complexity: Complexity;
  category: string[];
  id: number;

  constructor(
    title: string,
    description: string,
    complexity: Complexity,
    category: string[],
    id: number
  ) {
    this.title = title;
    this.description = description;
    this.complexity = complexity;
    this.category = category;
    this.id = id;
  }

  static fromJson(json: {
    title: string;
    description: string;
    complexity: number;
    category: string[];
    id: number;
  }) {
    return new this(
      json.title,
      json.description,
      json.complexity,
      json.category,
      json.id
    );
  }
}

export { Complexity, Question };
