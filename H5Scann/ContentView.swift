//
//  ContentView.swift
//  H5Scann
//
//  Created by song on 2025/3/18.
//

import SwiftUI
import SwiftData

struct ContentView: View {
    
    var url = URL(string: "https://ppofficial.pages.dev/")!

    var body: some View {
        WebView(url: url)
            .edgesIgnoringSafeArea(.horizontal)
    }

}

#Preview {
    ContentView()
}
