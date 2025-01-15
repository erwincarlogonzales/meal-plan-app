import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Calendar, Utensils } from 'lucide-react';

const MealPlanner = () => {
  const [meals, setMeals] = useState([]);
  const [newMeal, setNewMeal] = useState('');
  const [weeks, setWeeks] = useState(1);
  const [schedule, setSchedule] = useState(null);

  const addMeal = () => {
    if (newMeal.trim() && !meals.includes(newMeal.trim())) {
      setMeals([...meals, newMeal.trim()]);
      setNewMeal('');
    }
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const generateSchedule = () => {
    if (meals.length < 7) {
      alert('Please add at least 7 meals to generate a schedule');
      return;
    }

    const shuffledMeals = [...meals];
    const schedule = [];
    
    // Generate schedule ensuring no meal repeats within 2 weeks
    for (let week = 0; week < weeks; week++) {
      const weekMeals = [];
      const availableMeals = [...shuffledMeals];
      const recentMeals = schedule.flat().slice(-14); // Last 2 weeks of meals
      
      for (let day = 0; day < 7; day++) {
        const validMeals = availableMeals.filter(meal => !recentMeals.includes(meal));
        if (validMeals.length === 0) {
          // If no valid meals, reset and use any available meal
          const randomIndex = Math.floor(Math.random() * availableMeals.length);
          weekMeals.push(availableMeals[randomIndex]);
          availableMeals.splice(randomIndex, 1);
        } else {
          const randomIndex = Math.floor(Math.random() * validMeals.length);
          const selectedMeal = validMeals[randomIndex];
          weekMeals.push(selectedMeal);
          availableMeals.splice(availableMeals.indexOf(selectedMeal), 1);
        }
      }
      schedule.push(weekMeals);
    }
    setSchedule(schedule);
  };

  const getDayName = (index) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[index];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-6 h-6" />
            Meal Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Meal Input */}
            <div className="flex gap-2">
              <Input
                value={newMeal}
                onChange={(e) => setNewMeal(e.target.value)}
                placeholder="Enter a meal name"
                onKeyPress={(e) => e.key === 'Enter' && addMeal()}
                className="flex-1"
              />
              <Button onClick={addMeal} className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Meal
              </Button>
            </div>

            {/* Meal List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {meals.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                  <span>{meal}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMeal(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Week Selection and Generate Button */}
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <span>Weeks:</span>
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant={weeks === num ? "default" : "outline"}
                    onClick={() => setWeeks(num)}
                    className="w-10 h-10"
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <Button
                onClick={generateSchedule}
                className="ml-auto flex items-center gap-2"
                disabled={meals.length < 7}
              >
                <Calendar className="w-4 h-4" />
                Generate Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Display */}
      {schedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Your {weeks}-Week Meal Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {schedule.map((week, weekIndex) => (
                <div key={weekIndex} className="space-y-2">
                  <h3 className="font-semibold text-lg">Week {weekIndex + 1}</h3>
                  <div className="grid gap-2">
                    {week.map((meal, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="flex items-center p-3 bg-gray-50 rounded"
                      >
                        <span className="font-medium w-32">{getDayName(dayIndex)}:</span>
                        <span>{meal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealPlanner;