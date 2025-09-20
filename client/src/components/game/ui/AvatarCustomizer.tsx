import { useState } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { useGameProgress } from "../../../lib/stores/useGameProgress";
import { ArrowLeft, ShoppingCart } from "lucide-react";

interface AvatarCustomizerProps {
  onBack: () => void;
}

interface AvatarItem {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  type: 'hat' | 'shirt' | 'accessory';
}

export function AvatarCustomizer({ onBack }: AvatarCustomizerProps) {
  const { coins, ownedItems, equippedItems, buyItem, equipItem } = useGameProgress();
  const [selectedCategory, setSelectedCategory] = useState<'hat' | 'shirt' | 'accessory'>('hat');

  const avatarItems: AvatarItem[] = [
    // Hats
    { id: 'hat_1', name: 'Top Hat', emoji: '🎩', cost: 25, type: 'hat' },
    { id: 'hat_2', name: 'Baseball Cap', emoji: '🧢', cost: 15, type: 'hat' },
    { id: 'hat_3', name: 'Crown', emoji: '👑', cost: 100, type: 'hat' },
    
    // Shirts
    { id: 'shirt_1', name: 'T-Shirt', emoji: '👕', cost: 20, type: 'shirt' },
    { id: 'shirt_2', name: 'Dress Shirt', emoji: '👔', cost: 35, type: 'shirt' },
    { id: 'shirt_3', name: 'Hoodie', emoji: '🥼', cost: 30, type: 'shirt' },
    
    // Accessories
    { id: 'acc_1', name: 'Glasses', emoji: '👓', cost: 40, type: 'accessory' },
    { id: 'acc_2', name: 'Watch', emoji: '⌚', cost: 60, type: 'accessory' },
    { id: 'acc_3', name: 'Necklace', emoji: '📿', cost: 80, type: 'accessory' },
  ];

  const filteredItems = avatarItems.filter(item => item.type === selectedCategory);

  const handleBuyItem = (item: AvatarItem) => {
    if (coins >= item.cost) {
      buyItem(item.id, item.cost);
    }
  };

  const handleEquipItem = (itemId: string, type: string) => {
    equipItem(itemId, type);
  };

  return (
    <div className="avatar-customizer">
      <div className="customizer-header">
        <Button variant="ghost" onClick={onBack} className="back-button">
          <ArrowLeft size={20} />
          Back
        </Button>
        <h2>Customize Avatar</h2>
        <div className="coins-display">
          <span className="coins-emoji">💰</span>
          <span>{coins}</span>
        </div>
      </div>

      <div className="avatar-preview">
        <Card className="avatar-card">
          <div className="avatar-display">
            <div className="avatar-base">😊</div>
            {equippedItems.hat && (
              <div className="equipped-item hat">
                {avatarItems.find(item => item.id === equippedItems.hat)?.emoji}
              </div>
            )}
            {equippedItems.shirt && (
              <div className="equipped-item shirt">
                {avatarItems.find(item => item.id === equippedItems.shirt)?.emoji}
              </div>
            )}
            {equippedItems.accessory && (
              <div className="equipped-item accessory">
                {avatarItems.find(item => item.id === equippedItems.accessory)?.emoji}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="category-tabs">
        <Button
          variant={selectedCategory === 'hat' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('hat')}
        >
          🎩 Hats
        </Button>
        <Button
          variant={selectedCategory === 'shirt' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('shirt')}
        >
          👕 Shirts
        </Button>
        <Button
          variant={selectedCategory === 'accessory' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('accessory')}
        >
          👓 Accessories
        </Button>
      </div>

      <div className="items-grid">
        {filteredItems.map(item => {
          const isOwned = ownedItems.includes(item.id);
          const isEquipped = equippedItems[item.type] === item.id;
          const canAfford = coins >= item.cost;

          return (
            <Card key={item.id} className={`item-card ${isOwned ? 'owned' : ''} ${isEquipped ? 'equipped' : ''}`}>
              <div className="item-preview">
                <span className="item-emoji">{item.emoji}</span>
              </div>
              <h3 className="item-name">{item.name}</h3>
              <div className="item-cost">
                <span className="cost-emoji">💰</span>
                <span>{item.cost}</span>
              </div>
              
              {!isOwned ? (
                <Button 
                  onClick={() => handleBuyItem(item)}
                  disabled={!canAfford}
                  className="buy-button"
                  size="sm"
                >
                  <ShoppingCart size={16} />
                  Buy
                </Button>
              ) : isEquipped ? (
                <Button variant="outline" disabled size="sm">
                  Equipped
                </Button>
              ) : (
                <Button 
                  onClick={() => handleEquipItem(item.id, item.type)}
                  className="equip-button"
                  size="sm"
                >
                  Equip
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
