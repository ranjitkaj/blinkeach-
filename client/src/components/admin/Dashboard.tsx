import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SalesChart from './SalesChart';
import { 
  IndianRupee, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: dashboardStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard/stats'],
    suspense: false
  });

  const { data: recentOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['/api/admin/dashboard/recent-orders'],
    suspense: false
  });

  const { data: topProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard/top-products'],
    suspense: false
  });

  // Fallback data for development
  const fallbackStats = {
    revenue: {
      total: 12456800, // ₹1,24,568
      growth: 12
    },
    orders: {
      total: 846,
      growth: 8
    },
    customers: {
      total: 215,
      growth: 5
    },
    products: {
      total: 124,
      lowStock: 6
    }
  };

  const fallbackOrders = [
    {
      id: 7890,
      customerName: 'Rahul Sharma',
      date: '2023-04-11',
      amount: 245600, // ₹2,456
      status: 'delivered'
    },
    {
      id: 7889,
      customerName: 'Priya Patel',
      date: '2023-04-11',
      amount: 182900, // ₹1,829
      status: 'shipped'
    },
    {
      id: 7888,
      customerName: 'Amit Kumar',
      date: '2023-04-10',
      amount: 379000, // ₹3,790
      status: 'processing'
    }
  ];

  const fallbackTopProducts = [
    {
      id: 1,
      name: 'OnePlus Nord CE 3 Lite',
      sku: 'PHONE-001',
      category: 'Smartphones',
      price: 1699900, // ₹16,999
      sales: 87
    },
    {
      id: 3,
      name: 'boAt Rockerz 450 Headphones',
      sku: 'AUDIO-023',
      category: 'Audio',
      price: 149900, // ₹1,499
      sales: 65
    },
    {
      id: 2,
      name: 'Fire-Boltt Ninja Smart Watch',
      sku: 'WATCH-005',
      category: 'Wearables',
      price: 199900, // ₹1,999
      sales: 54
    }
  ];

  // Use fallback data if still loading or error
  const stats = dashboardStats || fallbackStats;
  const orders = recentOrders || fallbackOrders;
  const products = topProducts || fallbackTopProducts;

  // Status badge colors
  const statusColors: Record<string, string> = {
    'delivered': 'bg-green-100 text-green-800',
    'shipped': 'bg-blue-100 text-blue-800',
    'processing': 'bg-amber-100 text-amber-800',
    'cancelled': 'bg-red-100 text-red-800',
    'pending': 'bg-neutral-100 text-neutral-800'
  };

  // Format price to rupees
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Total Revenue</p>
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-32 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-neutral-800">{formatPrice(stats.revenue.total)}</h3>
                )}
                {isStatsLoading ? (
                  <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                  <p className={`text-xs flex items-center ${stats.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.revenue.growth >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.revenue.growth)}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                <IndianRupee className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Orders */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Total Orders</p>
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-neutral-800">{stats.orders.total}</h3>
                )}
                {isStatsLoading ? (
                  <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                  <p className={`text-xs flex items-center ${stats.orders.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.orders.growth >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.orders.growth)}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">New Customers</p>
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-neutral-800">{stats.customers.total}</h3>
                )}
                {isStatsLoading ? (
                  <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                  <p className={`text-xs flex items-center ${stats.customers.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.customers.growth >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(stats.customers.growth)}% from last month
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-500">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Products */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Products</p>
                {isStatsLoading ? (
                  <Skeleton className="h-8 w-20 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold text-neutral-800">{stats.products.total}</h3>
                )}
                {isStatsLoading ? (
                  <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                  <p className="text-xs text-amber-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {stats.products.lowStock} low in stock
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                <Package className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              {isStatsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <SalesChart chartType="line" />
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-60">
              {isProductsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <SalesChart chartType="bar" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 text-left text-sm">
                  <th className="py-3 px-4 font-medium">Order ID</th>
                  <th className="py-3 px-4 font-medium">Customer</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Amount</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isOrdersLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-16" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-32" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-16" /></td>
                    </tr>
                  ))
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-3 px-4">#{order.id}</td>
                      <td className="py-3 px-4">{order.customerName}</td>
                      <td className="py-3 px-4">{new Date(order.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td className="py-3 px-4">{formatPrice(order.amount)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status] || 'bg-neutral-100'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-secondary hover:text-secondary-dark mr-2">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                        </button>
                        <button className="text-neutral-500 hover:text-neutral-700">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 6 2 18 2 18 9"></polyline>
                            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                            <rect x="6" y="14" width="12" height="8"></rect>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-neutral-50 text-neutral-600 text-left text-sm">
                  <th className="py-3 px-4 font-medium">Product</th>
                  <th className="py-3 px-4 font-medium">SKU</th>
                  <th className="py-3 px-4 font-medium">Category</th>
                  <th className="py-3 px-4 font-medium">Price</th>
                  <th className="py-3 px-4 font-medium">Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isProductsLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <tr key={index}>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-48" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-24" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-20" /></td>
                      <td className="py-3 px-4"><Skeleton className="h-5 w-16" /></td>
                    </tr>
                  ))
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="text-sm">
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-neutral-600">{product.sku}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{formatPrice(product.price)}</td>
                      <td className="py-3 px-4">{product.sales} units</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
