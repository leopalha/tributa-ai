import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  Award,
  ShoppingCart,
  Star,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Search,
  Plus,
  Download,
  Eye,
  MessageSquare,
  ThumbsUp,
  Calendar,
  Target,
  Zap,
} from 'lucide-react';
import {
  arkhamIntelligenceService,
  IntelligenceItem,
  Bounty,
} from '@/services/arkham-intelligence.service';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const IntelExchange: React.FC = () => {
  const [intelligenceItems, setIntelligenceItems] = useState<IntelligenceItem[]>([]);
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBountyTitle, setNewBountyTitle] = useState('');
  const [newBountyDescription, setNewBountyDescription] = useState('');
  const [newBountyReward, setNewBountyReward] = useState('');

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [itemsData, bountiesData] = await Promise.all([
        arkhamIntelligenceService.getIntelligenceItems(
          selectedCategory === 'all' ? undefined : selectedCategory
        ).toPromise(),
        arkhamIntelligenceService.getBounties(
          selectedStatus === 'all' ? undefined : selectedStatus
        ).toPromise(),
      ]);

      setIntelligenceItems(itemsData || []);
      setBounties(bountiesData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBounty = () => {
    // Mock creation - in real app would call service
    const newBounty: Bounty = {
      id: Math.random().toString(36).substr(2, 9),
      title: newBountyTitle,
      description: newBountyDescription,
      reward: parseFloat(newBountyReward) || 0,
      status: 'open',
      createdBy: 'Current User',
      createdAt: new Date(),
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      submissions: 0,
    };

    setBounties([newBounty, ...bounties]);
    setIsCreateDialogOpen(false);
    setNewBountyTitle('');
    setNewBountyDescription('');
    setNewBountyReward('');
  };

  const filteredItems = intelligenceItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredBounties = bounties.filter(bounty =>
    bounty.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bounty.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return b.price - a.price;
      case 'popular':
        return b.purchases - a.purchases;
      case 'rating':
        return b.rating - a.rating;
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'analysis':
        return <TrendingUp className="h-4 w-4" />;
      case 'alert':
        return <Target className="h-4 w-4" />;
      case 'pattern':
        return <Zap className="h-4 w-4" />;
      case 'discovery':
        return <Eye className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'claimed':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      case 'completed':
        return 'text-blue-500 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Intel Exchange</h1>
          <p className="text-muted-foreground">
            Marketplace for blockchain intelligence and research bounties
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bounty
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Research Bounty</DialogTitle>
                <DialogDescription>
                  Create a bounty to incentivize research on specific topics
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Bounty Title</Label>
                  <Input
                    id="title"
                    value={newBountyTitle}
                    onChange={(e) => setNewBountyTitle(e.target.value)}
                    placeholder="Enter bounty title..."
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBountyDescription}
                    onChange={(e) => setNewBountyDescription(e.target.value)}
                    placeholder="Describe what you're looking for..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="reward">Reward (USD)</Label>
                  <Input
                    id="reward"
                    type="number"
                    value={newBountyReward}
                    onChange={(e) => setNewBountyReward(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <Button onClick={handleCreateBounty} className="w-full">
                  Create Bounty
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            My Purchases
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search intelligence items and bounties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="analysis">Analysis</SelectItem>
                <SelectItem value="alert">Alerts</SelectItem>
                <SelectItem value="pattern">Patterns</SelectItem>
                <SelectItem value="discovery">Discovery</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="marketplace" className="space-y-4">
        <TabsList>
          <TabsTrigger value="marketplace">Intelligence Marketplace</TabsTrigger>
          <TabsTrigger value="bounties">Research Bounties</TabsTrigger>
          <TabsTrigger value="analytics">Market Analytics</TabsTrigger>
        </TabsList>

        {/* Intelligence Marketplace */}
        <TabsContent value="marketplace">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(item.category)}
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${item.price}</p>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{item.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{item.purchases} purchases</span>
                      <span>{item.createdAt.toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Buy ${item.price}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Research Bounties */}
        <TabsContent value="bounties">
          <div className="space-y-4">
            {/* Bounties Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="claimed">Claimed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2 ml-auto">
                    <Badge variant="outline" className="text-green-600">
                      {bounties.filter(b => b.status === 'open').length} Open
                    </Badge>
                    <Badge variant="outline" className="text-yellow-600">
                      {bounties.filter(b => b.status === 'claimed').length} Claimed
                    </Badge>
                    <Badge variant="outline" className="text-blue-600">
                      {bounties.filter(b => b.status === 'completed').length} Completed
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bounties List */}
            <div className="space-y-4">
              {filteredBounties.map((bounty) => (
                <Card key={bounty.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="line-clamp-1">{bounty.title}</CardTitle>
                          <Badge className={getStatusColor(bounty.status)}>
                            {bounty.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                          {bounty.description}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          ${bounty.reward.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">Reward</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>By {bounty.createdBy}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Due {bounty.deadline.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{bounty.submissions} submissions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{bounty.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div className="flex gap-2">
                      {bounty.status === 'open' && (
                        <Button size="sm">
                          <Award className="h-3 w-3 mr-1" />
                          Submit Solution
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Discuss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Market Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Marketplace Value</p>
                    <p className="text-2xl font-bold">$2.4M</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Bounties</p>
                    <p className="text-2xl font-bold">
                      {bounties.filter(b => b.status === 'open').length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Intelligence Items</p>
                    <p className="text-2xl font-bold">{intelligenceItems.length}</p>
                  </div>
                  <Zap className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Rewards</p>
                    <p className="text-2xl font-bold">
                      ${bounties.reduce((sum, b) => sum + b.reward, 0).toLocaleString()}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Contributors */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>
                Most active researchers and bounty creators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contributor</TableHead>
                    <TableHead>Intelligence Items</TableHead>
                    <TableHead>Bounties Created</TableHead>
                    <TableHead>Bounties Completed</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: 'CryptoAnalyst42', items: 15, created: 8, completed: 12, earnings: 12500, rating: 4.8 },
                    { name: 'BlockchainDetective', items: 12, created: 5, completed: 18, earnings: 18200, rating: 4.9 },
                    { name: 'DeFiResearcher', items: 8, created: 12, completed: 6, earnings: 8900, rating: 4.6 },
                    { name: 'Web3Investigator', items: 20, created: 3, completed: 15, earnings: 15600, rating: 4.7 },
                  ].map((contributor, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {contributor.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{contributor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{contributor.items}</TableCell>
                      <TableCell>{contributor.created}</TableCell>
                      <TableCell>{contributor.completed}</TableCell>
                      <TableCell>${contributor.earnings.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{contributor.rating}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntelExchange;