// Service for interacting with the AI Design API
export interface DesignData {
  figmaLink?: string;
  previewImages?: string[];
  designDescription?: string;
  designElements?: {
    name: string;
    description: string;
    color?: string | null;
  }[];
}

export const generateUIDesign = async (
  projectTitle: string,
  projectDescription: string,
  projectId: string
): Promise<DesignData> => {
  try {
    console.log('Generating UI design for project:', projectId);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/generate-ui-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          title: projectTitle,
          description: projectDescription
        })
      });

      if (!response.ok) {
        console.warn(`Server returned ${response.status} status. Falling back to mock data.`);
        console.log('Server might not be running. Using mock data instead.');
        // If the server is not available, use mock data
        return getMockUIDesign();
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to generate UI design');
      }
      
      console.log('UI design generated successfully');
      return result.data;
    } catch (fetchError) {
      console.error('Network error occurred:', fetchError);
      console.log('Falling back to mock data due to network error');
      // If there's a network error (like server not running), use mock data
      return getMockUIDesign();
    }
  } catch (error) {
    console.error('Error in generateUIDesign:', error);
    // Return mock data as a fallback
    return getMockUIDesign();
  }
};

// For development testing - provides mock design data
export const getMockUIDesign = (): DesignData => {
  return {
    figmaLink: "https://www.figma.com/file/example12345/project-design",
    previewImages: [
      "https://storage.googleapis.com/openai-assets/figma-demos/dashboard-dark.png",
      "https://storage.googleapis.com/openai-assets/figma-demos/mobile-view.png",
      "https://storage.googleapis.com/openai-assets/figma-demos/components.png"
    ],
    designDescription: "This design concept embraces a dark mode interface with vibrant accents to create a modern, tech-forward aesthetic. The layout prioritizes clear information hierarchy with ample white space to enhance readability and focus. Interactive elements use subtle animations to provide feedback and enhance the user experience.",
    designElements: [
      {
        name: "Color Palette",
        description: "Dark background with blue and orange accent colors for interactive elements and highlights",
        color: "#181818"
      },
      {
        name: "Typography",
        description: "Clean sans-serif font system with varied weights for clear information hierarchy",
        color: "#FFFFFF"
      },
      {
        name: "Layout System",
        description: "Responsive grid system with consistent spacing to ensure coherence across different device sizes",
        color: "#1F2937"
      },
      {
        name: "Navigation",
        description: "Minimalist side navigation with contextual menus that appear when needed",
        color: "#0F172A"
      },
      {
        name: "Component Library",
        description: "Elevated UI components with subtle shadows and glows to create depth and focus",
        color: "#60A5FA"
      },
      {
        name: "Animation & Interactions",
        description: "Smooth, purposeful transitions and micro-interactions that guide user attention",
        color: "#F97316"
      },
      {
        name: "Accessibility Features",
        description: "High contrast ratios, keyboard navigation, and screen reader support built into all elements",
        color: null
      },
      {
        name: "Mobile Adaptation",
        description: "Streamlined layout for mobile with thumb-friendly interaction zones and simplified workflows",
        color: null
      }
    ]
  };
};
