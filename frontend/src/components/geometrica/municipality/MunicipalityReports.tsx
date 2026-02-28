import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { FileText, Download } from 'lucide-react';

export function MunicipalityReports() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="backdrop-blur-xl bg-white/5 border border-amber-500/20 p-6">
        <h3 className="text-xl text-white mb-4">Generate Reports</h3>
        <div className="flex gap-4">
          <Button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700">
            <Download className="w-4 h-4 mr-2" />
            Download Daily Report
          </Button>
          <Button variant="outline" className="border-amber-500/30 text-amber-400">
            <FileText className="w-4 h-4 mr-2" />
            Download Monthly Report
          </Button>
        </div>
      </Card>
    </div>
  );
}
