import Foundation
import Vision
import AppKit
let args = CommandLine.arguments
guard args.count > 1 else { exit(1) }
for path in args.dropFirst() {
    guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
    let req = VNRecognizeTextRequest()
    req.recognitionLevel = .accurate
    req.recognitionLanguages = ["pt-BR"]
    req.usesLanguageCorrection = true
    try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
    let all = req.results ?? []
    // página de jornal/Diário Oficial em duas colunas: lê a coluna da esquerda inteira e depois a da direita
    let largas = all.filter { $0.boundingBox.width > 0.6 }.count
    let estreitas = all.filter { $0.boundingBox.width < 0.55 }
    let esq = estreitas.filter { $0.boundingBox.midX < 0.5 }.count
    let dir = estreitas.filter { $0.boundingBox.midX >= 0.5 }.count
    var obs: [VNRecognizedTextObservation]
    if esq > 8 && dir > 8 && largas < all.count / 4 {
        let l = all.filter { $0.boundingBox.midX < 0.5 }.sorted { $0.boundingBox.minY > $1.boundingBox.minY }
        let r = all.filter { $0.boundingBox.midX >= 0.5 }.sorted { $0.boundingBox.minY > $1.boundingBox.minY }
        obs = l + r
    } else {
        obs = all.sorted { $0.boundingBox.minY > $1.boundingBox.minY }
    }
    print(obs.compactMap { $0.topCandidates(1).first?.string }.joined(separator: "\n"))
    print("<<<PAGINA>>>")
}
