pragma circom 2.0.0;

/*This circuit template checks that c is the multiplication of a and b.*/  

template FDEvaluator () {  
   // Declaration of signals.  
   signal input b;  
   var c = 144;  

   // Constraints.  
   c === a * b;  
}

component main = FDEvaluator();
