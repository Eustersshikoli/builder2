import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  BookOpen, 
  Download,
  Star,
  Users
} from "lucide-react";

interface Ebook {
  id: string;
  title: string;
  description: string;
  author: string;
  pages: number;
  downloadCount: number;
  rating: number;
  category: string;
  coverImage: string;
  fileUrl: string;
  publishDate: string;
  featured: boolean;
}

export default function EbookManager() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    pages: "",
    category: "",
    featured: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = () => {
    const storedEbooks = localStorage.getItem('forex_ebooks');
    if (storedEbooks) {
      setEbooks(JSON.parse(storedEbooks));
    }
  };

  const saveEbooks = (updatedEbooks: Ebook[]) => {
    localStorage.setItem('forex_ebooks', JSON.stringify(updatedEbooks));
    setEbooks(updatedEbooks);
  };

  const handleAddEbook = () => {
    if (!formData.title || !formData.description || !formData.author) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newEbook: Ebook = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      author: formData.author,
      pages: parseInt(formData.pages) || 50,
      downloadCount: 0,
      rating: 4.5,
      category: formData.category || "General",
      coverImage: `https://via.placeholder.com/300x400/3B82F6/FFFFFF?text=${encodeURIComponent(formData.title)}`,
      fileUrl: `/ebooks/${formData.title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      publishDate: new Date().toISOString().split('T')[0],
      featured: formData.featured
    };

    const updatedEbooks = [...ebooks, newEbook];
    saveEbooks(updatedEbooks);
    
    setShowAddForm(false);
    setFormData({
      title: "",
      description: "",
      author: "",
      pages: "",
      category: "",
      featured: false
    });

    toast({
      title: "Success",
      description: "Ebook added successfully",
    });
  };

  const handleEditEbook = (ebook: Ebook) => {
    setEditingEbook(ebook);
    setFormData({
      title: ebook.title,
      description: ebook.description,
      author: ebook.author,
      pages: ebook.pages.toString(),
      category: ebook.category,
      featured: ebook.featured
    });
    setShowAddForm(true);
  };

  const handleUpdateEbook = () => {
    if (!editingEbook) return;

    const updatedEbook: Ebook = {
      ...editingEbook,
      title: formData.title,
      description: formData.description,
      author: formData.author,
      pages: parseInt(formData.pages) || editingEbook.pages,
      category: formData.category || editingEbook.category,
      featured: formData.featured
    };

    const updatedEbooks = ebooks.map(e => e.id === editingEbook.id ? updatedEbook : e);
    saveEbooks(updatedEbooks);
    
    setShowAddForm(false);
    setEditingEbook(null);
    setFormData({
      title: "",
      description: "",
      author: "",
      pages: "",
      category: "",
      featured: false
    });

    toast({
      title: "Success",
      description: "Ebook updated successfully",
    });
  };

  const handleDeleteEbook = (id: string) => {
    const updatedEbooks = ebooks.filter(e => e.id !== id);
    saveEbooks(updatedEbooks);
    
    toast({
      title: "Success",
      description: "Ebook deleted successfully",
    });
  };

  const toggleFeatured = (id: string) => {
    const updatedEbooks = ebooks.map(e => 
      e.id === id ? { ...e, featured: !e.featured } : e
    );
    saveEbooks(updatedEbooks);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Educational Resources</h2>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-forex-600 hover:bg-forex-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Ebook
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingEbook ? "Edit Ebook" : "Add New Ebook"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter ebook title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  placeholder="Enter author name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter ebook description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({...formData, pages: e.target.value})}
                  placeholder="Number of pages"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select category</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Risk Management">Risk Management</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Technical Analysis">Technical Analysis</option>
                  <option value="Fundamental Analysis">Fundamental Analysis</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={editingEbook ? handleUpdateEbook : handleAddEbook}
                className="bg-success-600 hover:bg-success-700"
              >
                {editingEbook ? "Update Ebook" : "Add Ebook"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setEditingEbook(null);
                  setFormData({
                    title: "",
                    description: "",
                    author: "",
                    pages: "",
                    category: "",
                    featured: false
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ebooks List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className={`${ebook.featured ? 'ring-2 ring-gold-500' : ''}`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">{ebook.title}</h3>
                    {ebook.featured && (
                      <Badge className="bg-gold-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">by {ebook.author}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{ebook.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {ebook.pages} pages
                  </span>
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {ebook.downloadCount} downloads
                  </span>
                </div>
                <Badge variant="outline">{ebook.category}</Badge>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditEbook(ebook)}
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleFeatured(ebook.id)}
                  className={ebook.featured ? "bg-gold-50 border-gold-300" : ""}
                >
                  <Star className="h-3 w-3 mr-1" />
                  {ebook.featured ? "Unfeature" : "Feature"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteEbook(ebook.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ebooks.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ebooks Yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your first educational resource.</p>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-forex-600 hover:bg-forex-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Ebook
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
