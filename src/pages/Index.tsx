import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Power, Plus, Pencil, Trash2, Wifi, WifiOff } from "lucide-react";

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  status: "online" | "offline" | "waking";
}

const Index = () => {
  const [devices, setDevices] = useState<Device[]>([
    { id: "1", name: "Gaming PC", mac: "00:11:22:33:44:55", ip: "192.168.1.100", status: "offline" },
    { id: "2", name: "Media Server", mac: "AA:BB:CC:DD:EE:FF", ip: "192.168.1.101", status: "online" },
  ]);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({ name: "", mac: "", ip: "" });

  const handleWake = (device: Device) => {
    setDevices(prev => prev.map(d => 
      d.id === device.id ? { ...d, status: "waking" } : d
    ));
    
    toast({
      title: "Sending WoL Packet",
      description: `Waking up ${device.name}...`,
    });

    // Simulate wake process
    setTimeout(() => {
      setDevices(prev => prev.map(d => 
        d.id === device.id ? { ...d, status: "online" } : d
      ));
      toast({
        title: "Device Online",
        description: `${device.name} is now online!`,
      });
    }, 3000);
  };

  const handleAddDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: formData.name,
      mac: formData.mac,
      ip: formData.ip,
      status: "offline",
    };
    setDevices(prev => [...prev, newDevice]);
    setFormData({ name: "", mac: "", ip: "" });
    setIsAddDialogOpen(false);
    toast({
      title: "Device Added",
      description: `${newDevice.name} has been added to your network.`,
    });
  };

  const handleEditDevice = () => {
    if (!editingDevice) return;
    setDevices(prev => prev.map(d => 
      d.id === editingDevice.id 
        ? { ...d, name: formData.name, mac: formData.mac, ip: formData.ip }
        : d
    ));
    setEditingDevice(null);
    setFormData({ name: "", mac: "", ip: "" });
    toast({
      title: "Device Updated",
      description: "Device information has been updated.",
    });
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Device Removed",
      description: "Device has been removed from your network.",
    });
  };

  const openEditDialog = (device: Device) => {
    setEditingDevice(device);
    setFormData({ name: device.name, mac: device.mac, ip: device.ip });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Wifi className="w-10 h-10 text-primary" />
              Wake on LAN
            </h1>
            <p className="text-muted-foreground">Manage and wake your network devices remotely</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Device
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Device</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="name">Device Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Gaming PC"
                  />
                </div>
                <div>
                  <Label htmlFor="mac">MAC Address</Label>
                  <Input
                    id="mac"
                    value={formData.mac}
                    onChange={(e) => setFormData(prev => ({ ...prev, mac: e.target.value }))}
                    placeholder="00:11:22:33:44:55"
                  />
                </div>
                <div>
                  <Label htmlFor="ip">IP Address</Label>
                  <Input
                    id="ip"
                    value={formData.ip}
                    onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                    placeholder="192.168.1.100"
                  />
                </div>
                <Button onClick={handleAddDevice} className="w-full">Add Device</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => (
            <Card key={device.id} className="p-6 relative overflow-hidden border-border bg-card hover:border-primary/50 transition-all">
              {/* Status Indicator */}
              <div className="absolute top-4 right-4">
                {device.status === "online" ? (
                  <div className="flex items-center gap-2 text-success">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs font-medium">Online</span>
                  </div>
                ) : device.status === "waking" ? (
                  <div className="flex items-center gap-2 text-warning">
                    <Wifi className="w-4 h-4 animate-pulse" />
                    <span className="text-xs font-medium">Waking...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs font-medium">Offline</span>
                  </div>
                )}
              </div>

              {/* Device Info */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-4">{device.name}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono bg-secondary px-2 py-1 rounded">{device.mac}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="font-mono bg-secondary px-2 py-1 rounded">{device.ip}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleWake(device)}
                  disabled={device.status === "online" || device.status === "waking"}
                  className="flex-1 gap-2"
                  variant={device.status === "offline" ? "default" : "secondary"}
                >
                  <Power className="w-4 h-4" />
                  {device.status === "waking" ? "Waking..." : "Wake"}
                </Button>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => openEditDialog(device)}
                      variant="outline"
                      size="icon"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Device</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div>
                        <Label htmlFor="edit-name">Device Name</Label>
                        <Input
                          id="edit-name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-mac">MAC Address</Label>
                        <Input
                          id="edit-mac"
                          value={formData.mac}
                          onChange={(e) => setFormData(prev => ({ ...prev, mac: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-ip">IP Address</Label>
                        <Input
                          id="edit-ip"
                          value={formData.ip}
                          onChange={(e) => setFormData(prev => ({ ...prev, ip: e.target.value }))}
                        />
                      </div>
                      <Button onClick={handleEditDevice} className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={() => handleDeleteDevice(device.id)}
                  variant="outline"
                  size="icon"
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {devices.length === 0 && (
          <div className="text-center py-20">
            <WifiOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Devices Yet</h3>
            <p className="text-muted-foreground mb-6">Add your first device to get started</p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Device
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
