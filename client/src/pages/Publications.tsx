import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Users, Presentation, Download, ExternalLink, GraduationCap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { Publication, Citation } from "@shared/schema";

export default function Publications() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: publications = [], isLoading: publicationsLoading } = useQuery<Publication[]>({
    queryKey: ["/api/publications"],
  });

  const { data: citationData, isLoading: citationsLoading } = useQuery<Citation>({
    queryKey: ["/api/citations"],
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const handleRefreshCitations = async () => {
    try {
      // Refresh citation data
      await queryClient.invalidateQueries({ queryKey: ["/api/citations"] });
      toast({
        title: "Citations updated",
        description: "Citation data has been refreshed from Google Scholar.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not refresh citation data. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const journalFirstAuthor = publications.filter(p => p.type === "journal" && p.isFirstAuthor);
  const journalCoAuthor = publications.filter(p => p.type === "journal" && !p.isFirstAuthor);
  const conferencePublications = publications.filter(p => p.type === "conference");
  const totalJournalArticles = publications.filter(p => p.type === "journal").length;
  const totalConferenceArticles = publications.filter(p => p.type === "conference").length;

  const PublicationCard = ({ publication }: { publication: Publication }) => (
    <Card className="pub-card">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 text-lg">
              {publication.title}
            </h3>
            <p className="text-gray-600 text-sm mb-2">
              {publication.authors.split(", ").map((author, index) => (
                <span key={index}>
                  {author === "Laeeq Aslam" ? (
                    <span className="font-medium text-blue-600">{author}</span>
                  ) : (
                    author
                  )}
                  {index < publication.authors.split(", ").length - 1 && ", "}
                </span>
              ))}
            </p>
            <p className="text-gray-500 text-sm mb-2">
              <span className="font-medium text-blue-600">{publication.journal}</span>
              {publication.volume && `, ${publication.volume}`}
              {publication.pages && `, ${publication.pages}`}
              {`, ${publication.year}`}
            </p>
            {publication.citations > 0 && (
              <Badge variant="secondary" className="text-xs">
                {publication.citations} citations
              </Badge>
            )}
          </div>
          <div className="flex flex-col space-y-2 ml-4">
            {publication.pdfPath && (
              <Button
                size="sm"
                className="btn-primary"
                onClick={() => {
                  // Create a download link for the PDF
                  const link = document.createElement('a');
                  link.href = publication.pdfPath!;
                  link.download = `${publication.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="pt-16 academic-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Publications
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Complete list of research publications with real-time citation tracking.
            </p>
            
            {/* Statistics */}
            <div className="flex justify-center items-center space-x-4 flex-wrap gap-2 mb-6">
              <div className="citation-counter flex items-center space-x-2">
                {citationsLoading ? (
                  <div className="loading-spinner" />
                ) : null}
                <span className="text-lg font-bold">
                  {citationData?.totalCitations || 27}
                </span>
                <span>Citations</span>
              </div>
              <div className="text-gray-600">•</div>
              <div className="text-gray-600">{publications.length} Publications</div>
              <div className="text-gray-600">•</div>
              <div className="text-gray-600">{totalJournalArticles} Journal Articles</div>
              <div className="text-gray-600">•</div>
              <div className="text-gray-600">{totalConferenceArticles} Conference Papers</div>
            </div>
            
            {/* Refresh Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshCitations}
                className="flex items-center space-x-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                disabled={citationsLoading}
              >
                <RefreshCw className={`h-4 w-4 ${citationsLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Citations</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {publicationsLoading ? (
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <div className="space-y-4">
                  {[1, 2, 3].map((j) => (
                    <Card key={j}>
                      <CardContent className="p-6">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Journal Articles as First Author */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                Journal Articles as First Author ({journalFirstAuthor.length})
              </h2>
              <div className="space-y-4">
                {journalFirstAuthor.map((publication) => (
                  <PublicationCard key={publication.id} publication={publication} />
                ))}
              </div>
            </div>

            {/* Journal Articles as Co-Author */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Users className="h-6 w-6 text-blue-600 mr-3" />
                Journal Articles as Co-Author ({journalCoAuthor.length})
              </h2>
              <div className="space-y-4">
                {journalCoAuthor.map((publication) => (
                  <PublicationCard key={publication.id} publication={publication} />
                ))}
              </div>
            </div>

            {/* Conference Articles */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Presentation className="h-6 w-6 text-blue-600 mr-3" />
                Conference Articles ({conferencePublications.length})
              </h2>
              <div className="space-y-4">
                {conferencePublications.map((publication) => (
                  <PublicationCard key={publication.id} publication={publication} />
                ))}
              </div>
            </div>

            {/* Google Scholar Integration Note */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                  Real-time Citation Tracking
                </h3>
                <p className="text-gray-600 text-sm">
                  Citation counts are automatically updated from Google Scholar. Due to API limitations, 
                  updates may be delayed by 24-48 hours. For the most current citation information, 
                  please visit my{" "}
                  <a 
                    href="https://scholar.google.com/citations?user=oGVYJ5wAAAAJ&hl=en" 
                    className="text-blue-600 hover:text-blue-700 underline inline-flex items-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Scholar profile
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  .
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
