import { users, publications, citations, type User, type InsertUser, type Publication, type InsertPublication, type Citation, type InsertCitation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllPublications(): Promise<Publication[]>;
  getPublicationsByType(type: string): Promise<Publication[]>;
  getCurrentCitations(): Promise<Citation | undefined>;
  updateCitations(citations: InsertCitation): Promise<Citation>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private publications: Map<number, Publication>;
  private citations: Citation | undefined;
  private currentUserId: number;
  private currentPublicationId: number;

  constructor() {
    this.users = new Map();
    this.publications = new Map();
    this.currentUserId = 1;
    this.currentPublicationId = 1;
    this.citations = {
      id: 1,
      totalCitations: 27,
      lastUpdated: new Date().toISOString(),
    };
    this.initializePublications();
  }

  private initializePublications() {
    const publicationsData: Omit<Publication, 'id'>[] = [
      // Journal Articles as First Author
      {
        title: "Physics-informed spatio-temporal network with trainable adaptive feature selection for short-term wind speed prediction",
        authors: "Laeeq Aslam, Runmin Zou, Yaohui Huang, Ebrahim Shahzad Awan, Sharjeel Abid Butt, and Qian Zhou",
        journal: "Computers and Electrical Engineering",
        year: 2025,
        volume: "126",
        pages: "110517",
        doi: null,
        pdfPath: "/papers/physics-informed-spatio-temporal-network.pdf",
        type: "journal",
        isFirstAuthor: true,
        citations: 5,
      },
      {
        title: "Dynamic optimization of recurrent networks for wind prediction on edge devices",
        authors: "Laeeq Aslam, Runmin Zou, Ebrahim Shahzad Awan, Sayyed Shahid Hussain, Muhammad Asim, and Samia Allaoua Chelloug",
        journal: "IEEE Access",
        year: 2025,
        volume: null,
        pages: null,
        doi: null,
        pdfPath: "/papers/dynamic-optimization-recurrent-networks.pdf",
        type: "journal",
        isFirstAuthor: true,
        citations: 3,
      },
      {
        title: "Hardware-centric exploration of the discrete design space in transformer-LSTM models for wind speed prediction on memory-constrained devices",
        authors: "Laeeq Aslam, Runmin Zou, Ebrahim Shahzad Awan, Sayyed Shahid Hussain, Kashish Ara Shakil, Mudasir Ahmad Wani, and Muhammad Asim",
        journal: "Energies",
        year: 2025,
        volume: "18(9)",
        pages: "2153",
        doi: null,
        pdfPath: "/papers/hardware-centric-exploration-transformer-lstm.pdf",
        type: "journal",
        isFirstAuthor: true,
        citations: 2,
      },
      {
        title: "Novel image steganography based on preprocessing of secrete messages to attain enhanced data security and improved payload capacity",
        authors: "Laeeq Aslam, Ahmad Saeed, Ijaz Mansoor Qureshi, Muhammad Amir, and Waseem Khan",
        journal: "Traitement du Signal",
        year: 2020,
        volume: "37(1)",
        pages: null,
        doi: null,
        pdfPath: "/papers/novel-image-steganography.pdf",
        type: "journal",
        isFirstAuthor: true,
        citations: 8,
      },
      {
        title: "Effect of faulty sensors on estimation of direction of arrival and other parameters",
        authors: "Laeeq Aslam, Fawad Ahmad, Sohail Akhtar, Ebrahim Shahzad Awan, and Fatima Yaqoob",
        journal: "Journal of Mechanics of Continua and Mathematical Sciences",
        year: 2020,
        volume: "15(4)",
        pages: null,
        doi: null,
        pdfPath: "/papers/effect-faulty-sensors-doa.pdf",
        type: "journal",
        isFirstAuthor: true,
        citations: 1,
      },
      // Journal Articles as Co-Author
      {
        title: "A new computing paradigm for off-grid direction of arrival estimation using compressive sensing",
        authors: "Hamid Ali Mirza, Laeeq Aslam, Muhammad Asif Zahoor Raja, Naveed Ishtiaq Chaudhary, Ijaz Mansoor Qureshi, and Aqdas Naveed Malik",
        journal: "Wireless Communications and Mobile Computing",
        year: 2020,
        volume: "2020(1)",
        pages: "9280198",
        doi: null,
        pdfPath: "/papers/new-computing-paradigm-doa.pdf",
        type: "journal",
        isFirstAuthor: false,
        citations: 4,
      },
      {
        title: "Compressed sensing based image steganography system for secure transmission of audio message with enhanced security",
        authors: "Muhammad Zaheer, IM Qureshi, Zeeshan Muzaffar, and Laeeq Aslam",
        journal: "International Journal of Computer Science and Network Security",
        year: 2017,
        volume: "7",
        pages: "133–141",
        doi: null,
        pdfPath: "/papers/compressed-sensing-image-steganography.pdf",
        type: "journal",
        isFirstAuthor: false,
        citations: 2,
      },
      // Conference Articles
      {
        title: "Integrating physics-informed vectors for improved wind speed forecasting with neural networks",
        authors: "Laeeq Aslam, Runmin Zou, Ebrahim Awan, and Sharjeel Abid Butt",
        journal: "2024 14th Asian Control Conference (ASCC)",
        year: 2024,
        volume: null,
        pages: "1902–1907",
        doi: null,
        pdfPath: "/papers/integrating-physics-informed-vectors.pdf",
        type: "conference",
        isFirstAuthor: true,
        citations: 1,
      },
      {
        title: "Exploring new frontiers in facial expression recognition: Dual densenet-201 and landmark distance analytics in the wild",
        authors: "Abdullahi Mohamed Hassan, Xiaojun Zhou, and Laeeq Aslam",
        journal: "2024 IEEE 13th Data Driven Control and Learning Systems Conference (DDCLS)",
        year: 2024,
        volume: null,
        pages: "2036–2043",
        doi: null,
        pdfPath: "/papers/exploring-facial-expression-recognition.pdf",
        type: "conference",
        isFirstAuthor: false,
        citations: 0,
      },
      {
        title: "Towards efficient soh estimation for lithium-ion batteries via structural re-parameterization",
        authors: "Qian Zhou, Yun Wang, Guang Wu, and Laeeq Aslam",
        journal: "2024 IEEE 8th Conference on Energy Internet and Energy System Integration (EI2)",
        year: 2024,
        volume: null,
        pages: "2658–2663",
        doi: null,
        pdfPath: "/papers/efficient-soh-estimation-batteries.pdf",
        type: "conference",
        isFirstAuthor: false,
        citations: 1,
      },
    ];

    publicationsData.forEach((pub) => {
      const publication: Publication = {
        id: this.currentPublicationId++,
        ...pub,
      };
      this.publications.set(publication.id, publication);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllPublications(): Promise<Publication[]> {
    return Array.from(this.publications.values()).sort((a, b) => b.year - a.year);
  }

  async getPublicationsByType(type: string): Promise<Publication[]> {
    return Array.from(this.publications.values())
      .filter((pub) => pub.type === type)
      .sort((a, b) => b.year - a.year);
  }

  async getCurrentCitations(): Promise<Citation | undefined> {
    return this.citations;
  }

  async updateCitations(citationData: InsertCitation): Promise<Citation> {
    this.citations = {
      id: 1,
      ...citationData,
    };
    return this.citations;
  }
}

export const storage = new MemStorage();
