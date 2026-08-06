using ProductManagementSystem_.Models;
using System.Collections.Generic;

namespace ProductManagementSystem_.ViewModels
{
    public class DispositionViewModel
    {
        public Disposition Disposition { get; set; }

        public List<Disposition> DispositionList { get; set; }

        public DispositionViewModel()
        {
            Disposition = new Disposition();
            DispositionList = new List<Disposition>();
        }
    }
}